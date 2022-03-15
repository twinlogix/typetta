# Security

The concept of **data security** can be understood at different levels. In Typetta, we talk about security as a set of rules that, starting from the identity for which the data sources are questioned, are able to determine whether the requested operations are allowed or prohibited.

  - [Typetta, GraphQL and Security](#typetta-graphql-and-security)
  - [Definitions and Concepts](#definitions-and-concepts)
    - [Example](#example)
  - [How can I enable security?](#how-can-i-enable-security)
  - [Permissions on entity projections](#permissions-on-entity-projections)
  - [Permissions and security policies](#permissions-and-security-policies)
  - [Security Domains](#security-domains)
    - [Security domain field mapping](#security-domain-field-mapping)
    - [Operation security domain](#operation-security-domain)
  - [Implementation notes](#implementation-notes)

## Typetta, GraphQL and Security
Implementing **security policies** within the data access layer is a useful opportunity for the development of any back-end, which becomes almost a necessity for those looking to implement GraphQL back-ends.

Indeed, in GraphQL, each query allows the user to request a portion of the graph, generally without depth restrictions. If the resolution of connected entities and their relationships is handled by a library, as is the case in Typetta and most modern ORMs, then it is in this process that security policies must be defined. Doing it at the level of a single resolver would be extremely complex, repetitive, poorly maintained and underperforming.

Typetta therefore offers the possibility of defining a security level directly within the `DAOContext` and does so in a completely **type-safe** manner, as always.

## Definitions and Concepts

Speaking of security, at Typetta we refer to the following concepts:

- **Identity**: this is the subject for whom access to the data is requested; it can be a physical or logical user of the system, a third-party application, a subsystem, a super-admin, etc.

- **Resource**: this represents everything that needs to be secured, access to which by an `identity` can be determined by a set of rules. Specifically, resources are the individual records of each entity in the data model.

- **Permission**: this is a logical identifier in the form of a unique text code that represents a set of operations allowed on one or more `resources`.

- **Security Context**: this is the set of information that refers to an `identity` and that serves to determine whether or not it is authorised to carry out an operation. For example, the `security context` can contain a set of `permissions` or a complex data structure that defines a set of `permissions` that are limited to certain conditions. It is usually created at the same time as `identity` authentication.

- **Security Domain**: this represents a set of rules for grouping `resources` and is used to restrict the application of one or more `permissions`. Some examples of `security domains` can be "the set of resources that refer to user U1", "the set of resources that refer to tenant T1", etc. The concept of `security domain` is useful to shape `security contexts` in which an `identity` has different `permissions` for different groups of `resources`.

- **Security Policy**: this is the set of rules that determines the authorisation or prohibition to access a specific `resource` depending on the set of `permissions` available to the `identity` for which access is requested.

### Example
Below is a sample data model that shows all the concepts defined above:
```typescript
type User {
  id: ID!
  firstName: String
  lastName: String
  permissions: []
}

type UserPermission {
  userId: [ID!]
  permission: Permission!
}

enum Permissions {
  VIEW_POSTS
  MANAGE_POSTS
}

type Post {
  id: ID!
  userId: ID!
  content: String!
}
```

Given the above model, we can say that each `User` is an `identity` of the system and its posts are the `resources` to be secured. We then have two `permissions`, `VIEW_POSTS` and `MANAGE_POSTS`, which can be assigned to users and identify what they can do.

Let us now assume that we have two users within the system, defined by the following two `User` configurations:
```typescript
const mattia : User = {
  id: '1',
  firstName: 'Mattia',
  lastName: 'Minotti',
  permissions: [{ permission: 'MANAGE_POSTS' }, { permission: 'VIEW_POSTS' }]
}

const edoardo : User = {
  id: '2',
  firstName: 'Edoardo',
  lastName: 'Barbieri',
  permissions: [{ permission: 'MANAGE_POSTS', userId: ['2']}, { permission: 'VIEW_POSTS' }]
}
```

This configuration indicates that the user `Mattia` has permission to read and manage all the system posts, as his permissions have no restrictions, while the user `Edoardo` can read all the system posts but can only manage those that he has produced.

This example implicitly shows the `security domain` concept applied to the `MANAGE_POSTS` permission of the user `Edoardo`. It is in fact assigned to a single group of resources: "all the user's posts with an id of 2".

We can thus imagine, for each of the two users, the related `security context`:
```typescript
const mattiaSecurityContext = {
  userId: '1',
  permissions: {
    'MANAGE_POSTS': true,
    'VIEW_POSTS': true
  }
}
const edoardoSecurityContext = {
  userId: '2',
  permissions: {
    'MANAGE_POSTS': [{ userId: '2' }],
    'VIEW_POSTS': true
  }
}
```
`Security context` is nothing more than an extract of `identity` information, which serves to determine whether or not it can access `resources`. In this case, each permission is linked to a `security domain` or to the value `true`, which indicates all resources without domain restrictions.

The last component of the security layer is the `security policy`. The resource you want to secure is the `Post` entity, so you must define a `security policy` for this entity that contains the set of rules that determine the authorisation or prohibition of access to it.

```typescript
const postSecurityPolicy = {
  domain: {
    userId: true
  },
  permissions: {
    MANAGE_POSTS: {
      create: true,
      read: true,
      update: true,
      delete: true
    },
    VIEW_POSTS: {
      create: false,
      read: true,
      update: false,
      delete: false
    }
  }
}
```

In this way we have defined that:
- all users with the `MANAGE_POSTS` permission can perform all CRUD operations on entities in their `security domain`.
- all users with the `VIEW_POSTS` permission can only read entities within their `security domain`.

## How can I enable security?

The default behavior of a `DAOContext` is not to apply any security policy, leaving the Typetta user with full control. However, if you intend to manage security within Typetta, you can enable this feature by properly configuring the `DAOContext`:

```typescript
const daoContext = new DAOContext({
  security: {
    defaultPermissions: PERMISSION.DENY
  }
)
```
In this way the context is being told that, unless otherwise specified, access to each entity is completely prohibited. By doing so, in essence, no operation on any entity of the data model is authorised.

In addition to `DENY`, the system offers other convenience permission configurations, in particular: `ALLOW`, `DENY`, `READ_ONLY`, `CREATE_ONLY`, `UPDATE_ONLY`, `DELETE_ONLY`. However, you can have maximum flexibility by specifying the individual operations allowed as in the following example:

```typescript
const daoContext = new DAOContext({
  security: {
    defaultPermissions: {
      create: true,
      read: true,
      update: true,
      delete: false
    }
  }
)
```

In addition to specifying default permissions for the entire context, it is possible, and much more frequent, to define different permissions for each entity. Below is a simple example referred back to the previous data model:
```typescript
const daoContext = new DAOContext({
  security: {
    policies: {
      user: { defaultPermission: PERMISSION.READ_ONLY },
      userPermission: { defaultPermission: PERMISSION.READ_ONLY },
      post: { defaultPermission: PERMISSION.ALLOW },
    }
    defaultPermissions: PERMISSION.DENY
  }
)
```

Note how these largely demonstrative configurations showcase Typetta's simplicity when it comes to security management, but do not cover many real cases. Indeed, in the above definitions, the access permissions to the `resources` are fixed and not dependent on the calling `identity`. In the following sections, we will then discuss how to handle these more complex cases.

## Permissions on entity projections
We have previously seen how it is possible to restrict individual operations to one `resource`, explicitly specifying the ability to `create`, `read`, `update` and `delete`.

Reading operations very often require greater granularity in the definition of permissions and restrictions. In particular, the need to express different permissions for individual fields or portions of a `resource` is very frequent.

Typetta supports this need by providing the ability to specify any projection of the affected entity in the `read` parameter. Assuming you write a `security policy` for the `User` entity, you could then restrict read access to the `id`, `firstName` and `lastName` fields only.

```typescript
const daoContext = new DAOContext({
  security: {
    policies: {
      user: {
        read: {
          id: true,
          firstName: true,
          lastName: true,
        },
        write: false,
        update: false,
        delete: false
      },
    }
  }
)
```
## Permissions and security policies
In order to impose different restrictions to different `identities`, it is very useful to add the concept of `permission` that is able to group and reuse the access rules to the various `resources`.

Referring to the given model described in the previous [example](#example), a `DAOContext` can be defined in which the access policies to the individual entities depend on the user's permissions:

```typescript
const daoContext = new DAOContext({
  security: {
    // context is generated by authorization
    context: ['MANAGE_POSTS', 'VIEW_POSTS'],
    policies: {
      user: { defaultPermission: PERMISSION.READ_ONLY },
      userPermission: { defaultPermission: PERMISSION.READ_ONLY },
      post: {
        permissions: {
          MANAGE_POSTS: PERMISSION.ALLOW,
          VIEW_POSTS: PERMISSION.READ_ONLY,
        },
        defaultPermissions: PERMISSION.DENY,
      },
    }
    defaultPermissions: PERMISSION.DENY
  }
)
```

Note in particular the definition of the `context` field into which the caller `identity` permissions, typically loaded during an authentication process, will be placed. Correspondingly, the `security policy` for the post entity contains several `permissions` that are enforced depending on the calling `identity`.

## Security Domains

A `security domain` represents a set of `resources`, identified by a set of values in one or more fields. It is used to restrict the application of `permissions` with greater granularity.

To use a `security domain`, you must:
- define a `security context` in which, for each current `identity` `permission`, the domain to which it applies is specified.
- define the domains to which each `security policy` should apply.

Take, for example, the data model of the previous [example](#example). It defines a post entity that is linked to the user entity through a `userId` field. A user is normally allowed to perform each operation only on their own posts, that is, those that have a `userId` equal to their ids. All posts that have their `userId` constitute a `securityDomain`.

Below is an example of how you can configure the `DAOContext` so that a user can have `MANAGE_POSTS` permission only on their own posts and have `VIEW_POSTS` permission on all others:

```typescript
const daoContext = new DAOContext({
  security: {
    // context is generated by authorization
    context: {
      permissions: {
        'MANAGE_POSTS': [{ userId: 2}]
        'VIEW_POSTS': true
      }
    },
    policies: {
      post: {
        permissions: {
          MANAGE_POSTS: PERMISSION.ALLOW,
          VIEW_POSTS: PERMISSION.READ_ONLY,
        },
        defaultPermissions: PERMISSION.DENY,
      },
    }
    defaultPermissions: PERMISSION.DENY
  }
)
```

Note that, in this case, the `security context` is not only an array of `permissions`, but a map where it is possible to restrict the application domain for each `permission`. The specification `'MANAGE_POSTS': [{ userId: 2}]` is to be understood as: the current `identity` has the `permission` `MANAGE_POSTS` for all `resources` that have the `userId field = 2`. The value `true` indicates that the specific `permission` has no domain restriction.

Given this configuration, therefore, the system will authorize the user to perform any operation on their posts, while only the read operation on all others.

### Security domain field mapping

There are cases where a specific entity of the data model does not have certain fields of the `security domain`, or has them but with a different name. For both cases, you can specify a mapping on each `security policy`. For example, if the `Post` entity was defined as:

```typescript
type Post {
  id: ID!
  creatorId: ID!
  content: String!
}
```

Then the above `security policy` would become:

```typescript
const daoContext = new DAOContext({
  security: {
    // context is generated by authorization
    context: {
      permissions: {
        'MANAGE_POSTS': [{ userId: 2}]
        'VIEW_POSTS': true
      }
    },
    policies: {
      post: {
        domain: {
          userId: 'creatorId'
        },
        permissions: {
          MANAGE_POSTS: PERMISSION.ALLOW,
          VIEW_POSTS: PERMISSION.READ_ONLY,
        },
        defaultPermissions: PERMISSION.DENY,
      },
    }
    defaultPermissions: PERMISSION.DENY
  }
)
```

If a `security domain` field must be ignored in a specific `security policy`, you must specify the value `null` in the mapping of that field.

### Operation security domain

Whenever a `DAOContext` operation is performed for which a security configuration is specified, Typetta applies all the rules described above to determine whether the operation is allowed or prohibited. In the presence of different `security policies` for different `security domains`, not knowing which `security domain` will be the target of the operation, the system applies an intersection between all the `security policies` provided for the entity in question. Intersection means that an operation is allowed (or a visible field) only if it is allowed in all `security policies`.

Let's assume that we have two levels of visibility of the posts, one that allows reading of the entire post, `VIEW_POSTS`, and one that allows you to read only the content and not the author `VIEW_POSTS_CONTENT`. We then assume that a user has these two `permissions` on different `security domains`. Below is the definition of the `DAOContext`:

```typescript
const daoContext = new DAOContext({
  security: {
    // context is generated by authorization
    context: {
      permissions: {
        'VIEW_POSTS': [{ userId: 2}],
        'VIEW_POSTS_CONTENT': true
      }
    },
    policies: {
      post: {
        domain: {
          userId: 'creatorId'
        },
        permissions: {
          VIEW_POSTS: PERMISSION.READ_ONLY,
          VIEW_POSTS_CONTENT: {
            read: {
              id: true,
              content: true,
            }
          },
        },
        defaultPermissions: PERMISSION.DENY,
      },
    }
    defaultPermissions: PERMISSION.DENY
  }
)
```
Given this configuration, by performing a simple `findAll` operation on the `DAO` of the `Post` entity, the system applies the `VIEW_POSTS_CONTENT` `permission` because, in the absence of an explicit `security domain`, it is the most restrictive.Consequently, the following operation:
```typescript
const posts = dao.post.findAll();
```
Generates prohibited access error because the user does not have permission to access the `userId` field for all posts. The following, by contrast, is allowed because it is permitted regardless of the `security domain`:
```typescript
const posts = dao.post.findAll({
  projection: {
    id: true,
    content: true,
  }
});
```

To perform the `findAll` operation without restricting the request to some fields, you must restrict the request to the `security domain` `userId = 2`. To do this, Typetta uses the metadata operation mechanism that allows you to specify additional data for the request:
```typescript
const posts = dao.post.findAll({
  metadata: {
    userId: [2]
  }
});
```
This request does not generate any error and, on the contrary, it returns all the posts of user 2 and, of these posts, all the fields allowed by the `VIEW_POSTS` `permission`.

## Implementation notes
Typetta's security layer is fully implemented through the [middlewares](../client/middlewares.md) mechanism, of which it is a prime example.

All `security policies` are applied starting from the inputs of the operations, from the `security context` and from any `metadata` of the operation. These checks are performed before the operations are performed, so no queries are made if not authorised, and no checks are made on the individual records returned. In this way, security controls are carried out in a highly efficient manner.





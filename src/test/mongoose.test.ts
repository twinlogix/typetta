import mongoose from "mongoose";
import { MockMongoose } from 'mock-mongoose';
import { DAOContext, SecurityContext, UserFilter } from "./dao.mock";
import { Maybe, User } from "./models.mock";
import { SortDirection } from "..";
import BigNumber from 'bignumber.js';
import { Expand, ModelProjection, OmitUndefinedAndNeverKeys, ParamProjection, Projection, StaticProjection } from "../utils/types";
import { buildComputedField, projectionDependency } from "../dal/dao";
import { projection } from "../utils/projection";
import { Test, typeAssert } from "./utils.test";
import { PartialDeep } from "type-fest";

const mockMongoose: MockMongoose = new MockMongoose(mongoose);
const dao = new DAOContext();

beforeAll(done => {
    mockMongoose.prepareStorage().then(async () => {
        await mongoose.connect('mongodb://test-host/test-db');
        done();
    });
});

beforeEach(async (done) => {
    await mockMongoose.helper.reset();
    done();
});


// ------------------------------------------------------------------------
// ---------------------------- FIND --------------------------------------
// ------------------------------------------------------------------------
test("empty find", async () => {
    let response;

    response = await dao.user.findMany({});
    expect(response.length).toBe(0);

    response = await dao.user.findFirst({});
    expect(response).toBeNull();

});

test("simple find", async () => {
    let response;

    await dao.user.insert({ firstName: "FirstName", lastName: "LastName", live: true });

    response = await dao.user.findMany({});
    expect(response.length).toBe(1);
    expect(response[0].firstName).toBe("FirstName");
    expect(response[0].lastName).toBe("LastName");

});

test("find nested foreign association", async () => {
    await dao.organization.insert({ id: "organization1", name: "Organization 1", address: { id: "address1" } });
    await dao.city.insert({ id: "city1", name: "City 1", addressId: "address1" });
    await dao.city.insert({ id: "city2", name: "City 2", addressId: "address1" });

    const response = await dao.organization.findMany({ projection: { id: true, address: { id: true, cities: { id: true, addressId: true, name: true } } } });
    expect(response.length).toBe(1);
    expect(response[0].address?.cities?.length).toBe(2);
    expect((response[0].address?.cities!)[0].name).toBe("City 1");
    expect((response[0].address?.cities!)[1].name).toBe("City 2");

});

// ------------------------------------------------------------------------
// -------------------------- PAGINATION ----------------------------------
// ------------------------------------------------------------------------
test("find with start", async () => {
    let response;

    for (let i = 0; i < 10; i++) {
        await dao.user.insert({ firstName: "" + i, live: true });
    }

    response = await dao.user.findMany({ start: 0});
    expect(response.length).toBe(10);
    expect(response[0].firstName).toBe("0");
    expect(response[1].firstName).toBe("1");

    response = await dao.user.findMany({ start: 5});
    expect(response.length).toBe(5);
    expect(response[0].firstName).toBe("5");
    expect(response[1].firstName).toBe("6");

    response = await dao.user.findMany({ start: 10});
    expect(response.length).toBe(0);

    response = await dao.user.findMany({ start: 20});
    expect(response.length).toBe(0);

});

test("find with limit", async () => {
    let response;

    for (let i = 0; i < 10; i++) {
        await dao.user.insert({ firstName: "" + i, live: true });
    }

    response = await dao.user.findMany({ limit: 0});
    expect(response.length).toBe(0);

    response = await dao.user.findMany({ limit: 1});
    expect(response.length).toBe(1);
    expect(response[0].firstName).toBe("0");

    response = await dao.user.findMany({ limit: 2});
    expect(response.length).toBe(2);
    expect(response[0].firstName).toBe("0");
    expect(response[1].firstName).toBe("1");

    response = await dao.user.findMany({ limit: 10});
    expect(response.length).toBe(10);

    response = await dao.user.findMany({ limit: 100});
    expect(response.length).toBe(10);

});

test("find with simple sorts", async () => {
    let response;

    for (let i = 0; i < 10; i++) {
        await dao.user.insert({ firstName: "" + i, lastName: "" + (9 - i), live: true });
    }

    response = await dao.user.findMany({ sort: [{ firstName: SortDirection.DESC }]});
    expect(response[0].firstName).toBe("9");
    expect(response[1].firstName).toBe("8");

    response = await dao.user.findMany({ sort: { firstName: SortDirection.DESC }});
    expect(response[0].firstName).toBe("9");

    response = await dao.user.findMany({ sort: [{ firstName: SortDirection.DESC }]});
    expect(response[0].firstName).toBe("9");

    response = await dao.user.findMany({ sort: [{ firstName: SortDirection.ASC }]});
    expect(response[0].firstName).toBe("0");
    expect(response[1].firstName).toBe("1");


});

test("find with multiple sorts", async () => {
    let response;

    for (let i = 0; i < 10; i++) {
        await dao.user.insert({ firstName: "1", lastName: "" + (9 - i), live: true });
    }

    response = await dao.user.findMany({ sort: [{ firstName: SortDirection.DESC }, { lastName: SortDirection.DESC }]});
    expect(response[0].lastName).toBe("9");
    expect(response[1].lastName).toBe("8");

});

test("find with start and limit", async () => {
    let response;

    for (let i = 0; i < 10; i++) {
        await dao.user.insert({ firstName: "" + i, live: true });
    }

    response = await dao.user.findMany({ start: 0, limit: 0});
    expect(response.length).toBe(0);

    response = await dao.user.findMany({ start: 1, limit: 1});
    expect(response.length).toBe(1);
    expect(response[0].firstName).toBe("1");

    response = await dao.user.findMany({ start: 1, limit: 0});
    expect(response.length).toBe(0);

    response = await dao.user.findMany({ start: 2, limit: 2});
    expect(response.length).toBe(2);
    expect(response[0].firstName).toBe("2");
    expect(response[1].firstName).toBe("3");

    response = await dao.user.findMany({ start: 8, limit: 10});
    expect(response.length).toBe(2);
    expect(response[0].firstName).toBe("8");
    expect(response[1].firstName).toBe("9");

});

// ------------------------------------------------------------------------
// -------------------------- INSERT --------------------------------------
// ------------------------------------------------------------------------
test("simple insert", async () => {
    let response;

    response = await dao.user.findMany({});
    expect(response.length).toBe(0);

    await dao.user.insert({ firstName: "FirstName", lastName: "LastName", live: true });
    response = await dao.user.findMany({});
    expect(response.length).toBe(1);

});

test("ID auto-generation and find by id", async () => {
    let response;

    const { id } = await dao.user.insert({ firstName: "FirstName", lastName: "LastName", live: true });
    expect(id).toBeDefined();

    response = await dao.user.findMany({ filter: { id }});
    expect(response.length).toBe(1);

});

test("insert and find embedded entity", async () => {
    let response;

    await dao.user.insert({ usernamePasswordCredentials: { username: "username", password: "password" }, live: true });

    response = await dao.user.findMany({});
    expect(response.length).toBe(1);
    expect(response[0].usernamePasswordCredentials).toBeDefined();
    expect(response[0].usernamePasswordCredentials!.username).toBe("username");
    expect(response[0].usernamePasswordCredentials!.password).toBe("password");

});

// ------------------------------------------------------------------------
// ------------------------------ UPDATE ----------------------------------
// ------------------------------------------------------------------------
test("simple update", async () => {
    const user = await dao.user.insert({ firstName: "FirstName", live: true });

    await dao.user.update(user, { lastName: "LastName" });
    const user2 = await dao.user.findFirst({ filter: { id: user.id } });

    expect(user2!.firstName).toBe(user.firstName);
    expect(user2!.lastName).toBe("LastName");

    await dao.user.update(user, { firstName: "NewFirstName" });
    const user3 = await dao.user.findFirst({ filter: { id: user.id } });

    expect(user3!.firstName).toBe("NewFirstName");
    expect(user3!.lastName).toBe(user3!.lastName);
});

test("update embedded entity", async () => {

    const user = await dao.user.insert({ firstName: "FirstName", live: true });

    await dao.user.update(user, { usernamePasswordCredentials: { username: "username", password: "password" } });
    const user2 = await dao.user.findFirst({ filter: { id: user.id } });

    expect(user2!.usernamePasswordCredentials).toBeDefined();
    expect(user2!.usernamePasswordCredentials!.username).toBe("username");
    expect(user2!.usernamePasswordCredentials!.password).toBe("password");

    await dao.user.update(user, { usernamePasswordCredentials: { username: "newUsername", password: "newPassword" } });
    const user3 = await dao.user.findFirst({ filter: { id: user.id } });

    expect(user3!.usernamePasswordCredentials).toBeDefined();
    expect(user3!.usernamePasswordCredentials!.username).toBe("newUsername");
    expect(user3!.usernamePasswordCredentials!.password).toBe("newPassword");

    await dao.user.update(user, { "usernamePasswordCredentials.username": "newUsername_2" });
    const user4 = await dao.user.findFirst({ filter: { id: user.id } });

    expect(user4!.usernamePasswordCredentials).toBeDefined();
    expect(user4!.usernamePasswordCredentials!.username).toBe("newUsername_2");
    expect(user4!.usernamePasswordCredentials!.password).toBe("newPassword");

});


// ------------------------------------------------------------------------
// ------------------------------ REPLACE ---------------------------------
// ------------------------------------------------------------------------
test("simple replace", async () => {

    let user: (User | null) = await dao.user.insert({ firstName: "FirstName", live: true });
    await dao.user.replace(user, { id: user.id, firstName: "FirstName 1", live: true });
    user = await dao.user.findFirst({ filter: { id: user!.id } });

    expect(user).toBeDefined();
    expect(user?.firstName).toBe("FirstName 1");
});


// ------------------------------------------------------------------------
// ------------------------------ DELETE ----------------------------------
// ------------------------------------------------------------------------
test("simple delete", async () => {

    let user: (User | null) = await dao.user.insert({ firstName: "FirstName", live: true });

    user = await dao.user.findFirst({ filter: { id: user.id } });
    expect(user).toBeDefined();

    await dao.user.delete(user!);

    user = await dao.user.findFirst({ filter: { id: user!.id } });
    expect(user).toBeNull();
});

// ------------------------------------------------------------------------
// --------------------------- GEOJSON FIELD ------------------------------
// ------------------------------------------------------------------------
test("insert and retrieve geojson field", async () => {

    const iuser: (User | null) = await dao.user.insert({ firstName: "FirstName", live: true, localization: { latitude: 1.111, longitude: 2.222 } });

    const user = await dao.user.findFirst({ filter: { id: iuser.id }, projection: { id: true, localization: true } });
    expect(user).toBeDefined();
    expect(user!.localization?.latitude).toBe(1.111);
    expect(user!.localization?.longitude).toBe(2.222);

});

// ------------------------------------------------------------------------
// --------------------------- DECIMAL FIELD ------------------------------
// ------------------------------------------------------------------------

test("insert and retrieve decimal field", async () => {

    const iuser: (User | null) = await dao.user.insert({ id: 'ID1', firstName: "FirstName", live: true, amount: new BigNumber(12.12) });

    const user1 = await dao.user.findFirst({ filter: { id: iuser.id }, projection: { id: true, amount: true } });
    expect(user1).toBeDefined();
    expect(user1!.amount!.comparedTo(12.12)).toBe(0);

    const user2 = await dao.user.findFirst({ filter: { amount: new BigNumber(12.12) }, projection: { id: true, amount: true }});
    expect(user2).toBeDefined();
    expect(user2!.amount!.comparedTo(12.12)).toBe(0);
    expect(user2!.id!).toBe('ID1');

});

test("update and retrieve decimal field", async () => {

    const iuser: (User | null) = await dao.user.insert({ firstName: "FirstName", live: true, amount: new BigNumber(12.12) });

    const user = await dao.user.findFirst({ filter: { id: iuser.id }, projection: { id: true, amount: true } });
    expect(user).toBeDefined();
    expect(user!.amount!.comparedTo(12.12)).toBe(0);

    await dao.user.update(user!, { amount: new BigNumber(14.14) });
    const user1 = await dao.user.findFirst({ filter: { id: user!.id }, projection: { id: true, amount: true } });

    expect(user1).toBeDefined();
    expect(user1!.amount!.comparedTo(14.14)).toBe(0);

});

test("insert and retrieve decimal array field", async () => {

    const iuser: (User | null) = await dao.user.insert({ firstName: "FirstName", live: true, amounts: [new BigNumber(1.02), new BigNumber(2.223)] });

    const user = await dao.user.findFirst({ filter: { id: iuser.id }, projection: { id: true, amounts: true } });
    expect(user).toBeDefined();
    expect(user!.amounts?.length).toBe(2);
    expect(user!.amounts![0].comparedTo(1.02)).toBe(0);
    expect(user!.amounts![1].comparedTo(2.223)).toBe(0);

});

// ------------------------------------------------------------------------
// ---------------------- LOCALIZED STRING FIELD --------------------------
// ------------------------------------------------------------------------
test("insert and retrieve localized string field", async () => {

    const iuser: (User | null) = await dao.user.insert({ firstName: "FirstName", live: true, title: { it: "Ciao", en: "Hello" } });

    const user = await dao.user.findFirst({ filter: { id: iuser.id }, projection: { id: true, title: true }});
    expect(user).toBeDefined();
    expect(user!.title?.en).toBe("Hello");
    expect(user!.title?.it).toBe("Ciao");

});



// ------------------------------------------------------------------------
// ------------------------- COMPUTED FIELDS ------------------------------
// ------------------------------------------------------------------------
/*
test("computed fields (one dependency - same level - one calculated)", async () => {

    const dao = new DAOContext<SecurityContext>({
        daoOverrides: {
            city: {
                middlewares: [
                    buildComputedField({
                        fieldsProjection: { computedName: true },
                        requiredProjection: { name: true },
                        compute: async city => ({ computedName: `Computed: ${city.name}` })
                    })
                ]
            }
        }
    });

    await dao.city.insert({ id: "cesena", name: "Cesena", addressId: "address1" });
    await dao.city.insert({ id: "forlì", name: "Forlì", addressId: "address1" });

    const cesena = await dao.city.findOne({ id: "cesena" }, { id: true, computedName: true })
    const forli = await dao.city.findOne({ id: "forlì" }, { computedName: true })

    expect(cesena?.computedName).toBe("Computed: Cesena");
    //expect(cesena?.name).toBe("Cesena");
    expect(cesena?.id).toBe("cesena");

    expect(forli?.computedName).toBe("Computed: Forlì");
    //expect(forli?.name).toBe("Forlì");
    //expect(forli?.id).toBe(undefined);
});*/
/*
test("computed fields (two dependencies - same level - one calculated)", async () => {

    const dao = new DAOContext<SecurityContext>({
        daoOverrides: {
            city: {
                middlewares: [
                    buildComputedField({
                        fieldsProjection: { computedAddressName: true },
                        requiredProjection: { name: true, addressId: true },
                        compute: async city => ({ computedAddressName: `${city.name}_${city.addressId}` })
                    })
                ]
            }
        }
    });

    await dao.city.insert({ id: "milano", name: "Milano", addressId: "address1" });

    const milano = await dao.city.findOne({ id: "milano" }, { computedAddressName: true })

    expect(milano?.computedAddressName).toBe("Milano_address1");
    //expect(milano?.name).toBe("Milano");
    //expect(milano?.addressId).toBe("address1");
});*/

/*
test("computed fields (two dependencies - same level - two calculated)", async () => {

    const dao = new DAOContext<SecurityContext>({
        daoOverrides: {
            city: {
                middlewares: [
                    buildComputedField({
                        fieldsProjection: { computedName: true },
                        requiredProjection: { name: true },
                        compute: async city => ({ computedName: `Computed: ${city.name}` })
                    }),
                    buildComputedField({
                        fieldsProjection: { computedAddressName: true },
                        requiredProjection: { name: true, addressId: true },
                        compute: async city => ({ computedAddressName: `${city.name}_${city.addressId}` })
                    })
                ]
            }
        }
    });

    await dao.city.insert({ id: "torino", name: "Torino", addressId: "address1" });

    const torino = await dao.city.findOne({ id: "torino" }, { computedName: true, computedAddressName: true })

    expect(torino?.computedAddressName).toBe("Torino_address1");
    expect(torino?.computedName).toBe("Computed: Torino");
    //expect(torino?.name).toBe("Torino");
    //expect(torino?.addressId).toBe("address1");
});*/

/*
test("computed fields (one dependency - same level - one calculated - multiple models)", async () => {

    const dao = new DAOContext<SecurityContext>({
        daoOverrides: {
            city: {
                middlewares: [
                    buildComputedField({
                        fieldsProjection: { computedName: true },
                        requiredProjection: { name: true },
                        compute: async city => ({ computedName: `Computed: ${city.name}` })
                    })
                ]
            }
        }
    });

    await dao.city.insert({ id: "c1", name: "c1", addressId: "address1" });
    await dao.city.insert({ id: "c2", name: "c1", addressId: "address1" });
    await dao.city.insert({ id: "c3", name: "c1", addressId: "address1" });

    const cities = await dao.city.find({}, { id: true, computedName: true })

    cities.forEach(c => {
        expect(c?.computedName).toBe("Computed: c1");
    })
});*/

/*
test("computed fields (one dependency - deep level - one calculated)", async () => {

    const dao = new DAOContext<SecurityContext>({
        daoOverrides: {
            organization: {
                middlewares: [
                    buildComputedField({
                        fieldsProjection: { computedName: true },
                        requiredProjection: { name: true },
                        compute: async organization => ({ computedName: `Computed: ${organization.name}` })
                    })
                ]
            }
        }
    });

    const org = await dao.organization.insert({ id: "org1", name: "org1" });
    const user = await dao.customerUser.insert({ id: "u1", organizationId: org.id, live: true });
    expect(user?.organization?.computedName).toBe(undefined);

    const user2 = await dao.customerUser.findOne({ id: "u1" }, { organization: { computedName: true } });
    expect(user2?.organization?.computedName).toBe("Computed: org1");

    const user3 = await dao.customerUser.findOne({ id: "u1" }, { organization: true });
    expect(user3?.organization?.computedName).toBe("Computed: org1");

    const user4 = await dao.customerUser.findOne({ id: "u1" }, { id: true });
    //expect(user4?.organization?.computedName).toBe(undefined);
});
*/
/*
test("computed fields (two dependency - deep level - two calculated)", async () => {

    const dao = new DAOContext<SecurityContext>({
        daoOverrides: {
            organization: {
                middlewares: [
                    buildComputedField({
                        fieldsProjection: { computedName: true },
                        requiredProjection: { name: true },
                        compute: async organization => ({ computedName: `Computed: ${organization.name}` })
                    }), 
                    buildComputedField({
                        fieldsProjection: { computedName: true },
                        requiredProjection: { name: true },
                        compute: async organization => ({ computedName: `Computed: ${organization.name}` })
                    })
                ]
            },
            customerUser: {
                middlewares: [
                    buildComputedField({
                        fieldsProjection: { computedOrgName: true },
                        requiredProjection: { organization: { name: true, computedName: true } },
                        compute: async customerUser => ({ computedOrgName: `Computed2: ${customerUser.organization?.computedName}` })
                    })
                ]
            }
        }
    });

    const org = await dao.organization.insert({ id: "org2", name: "org2" });
    await dao.customerUser.insert({ id: "u2", organizationId: org.id, live: true });
    await dao.customerUser.insert({ id: "u3", live: true });

    const user1 = await dao.customerUser.findOne({ id: "u2" }, { computedOrgName: true });
    //expect(user1?.organization?.computedName).toBe("Computed: org2");
    expect(user1?.computedOrgName).toBe("Computed2: Computed: org2");

    const user2 = await dao.customerUser.findOne({ id: "u3" }, { computedOrgName: true });
    //expect(user2?.organization?.computedName).toBe(undefined);
    expect(user2?.computedOrgName).toBe("Computed2: undefined");

    const user3 = await dao.customerUser.findOne({ id: "u3" }, undefined);
    expect(user3?.computedOrgName).toBe("Computed2: undefined");

    const user4 = await dao.customerUser.findOne({ id: "u4" }, undefined);
    expect(user4).toBe(null);
});*/

/*test("middleware", async () => {
    let afterInsertCount = 0
    const dao = new DAOContext<SecurityContext>({
        daoOverrides: {
            customerUser: {
                middlewares: [ {
                    beforeInsert: async (record) => {
                        if(record.id === "u1" && record.firstName === "Mario") {
                            return { error: new Error("is Mario") }
                        }
                        if(record.firstName) {
                            return { record: {...record, firstName: record.firstName.toUpperCase() }}
                        }
                    },
                    afterInsert: async (record, result) => {
                        if(record.id === "u1") {
                            expect(record.firstName).toBe("LUIGI");
                            expect(result.firstName).toBe("LUIGI");
                            afterInsertCount++
                        }
                    },
                    beforeUpdate: async (filter, changes) => {
                        if(filter.id === "u1" && changes.firstName) {
                            return { changes: { ...changes, firstName: changes.firstName.toLocaleLowerCase() } }
                        }
                    },
                    afterUpdate: async (filter, changes) => {
                        if(filter.id === "u1" && changes.firstName === "luigi") {
                            await dao.customerUser.updateOne({ id: "u1" }, { firstName: "MARIO" });
                        }
                    },
                    beforeDelete: async (filter) => {
                        if(filter.id === "u1") {
                            return { cancel: true }
                        }
                    },
                }, 
                {
                    afterDelete: async (filter) => {
                        if(filter.id === "u2") {
                            await dao.customerUser.insert({ id: "u3", firstName: "Nico", live: true })
                        }
                    },
                },
                {
                    beforeReplace: async (filter, to) => {
                        if(to.id === "u4") {
                            return { to: { id: "u5", live: true} }
                        }
                    },
                    afterReplace: async (filter, to) => {
                        if(to.id === "u5") {
                            await dao.customerUser.insert({id: "u6", live: true})
                        }
                    },
                }, 
                projectionDependency( { fieldsProjection: { id: true }, requiredProjection: { live: true } } ),
            ]
            }
        }
    });

    try {
        await dao.customerUser.insert({ id: "u1", firstName: "Mario", live: true })
        fail()
    } catch (error) {
        expect((error as Error).message).toBe("is Mario")
    }

    await dao.customerUser.insert({ id: "u1", firstName: "Luigi", live: true })
    expect(afterInsertCount).toBe(1)

    await dao.customerUser.updateOne({ id: "u1" }, { firstName: "LUigi" })
    const firstName = (await dao.customerUser.findOne({ id: "u1" }))?.firstName
    expect(firstName).toBe("mario")

    await dao.customerUser.deleteOne({id: "u1"})
    expect((await dao.customerUser.exists({ id: "u1" }))).toBe(true)

    await dao.customerUser.insert({ id: "u2", firstName: "Mario", live: true })
    await dao.customerUser.deleteOne({id: "u2"})
    expect((await dao.customerUser.exists({ id: "u3" }))).toBe(true)

    await dao.customerUser.replaceOne({id: "u3"}, {live: true, id: "u4"})
    expect((await dao.customerUser.exists({ id: "u5" }))).toBe(true)
    expect((await dao.customerUser.exists({ id: "u6" }))).toBe(true)

    const r1 = await dao.customerUser.findOne({id: "u6"}, {id:true})
    expect(r1?.id).toBe("u6")
    expect((r1 as any)?.live).toBe(true)
});*/


// ------------------------------------------------------------------------
// ------------------------------ READ 2 ----------------------------------
// ------------------------------------------------------------------------
test("safe find", async () => {
    await dao.user.insert({ id: "u1", firstName: "FirstName", lastName: "LastName", live: true });

    //Static projection
    const response = await dao.user.findMany({ projection: { firstName: true, live: true } })
    typeAssert<Test<typeof response, { firstName?: string | null, live: boolean, __projection: { firstName: true, live: true } }[]>>()
    expect(response.length).toBe(1);
    expect(response[0].firstName).toBe("FirstName");
    expect(response[0].live).toBe(true);

    //Static projection
    const response1 = await dao.user.findFirst({ filter: { id: "u2" }, projection: { live: true } })
    typeAssert<Test<typeof response1, { live: boolean, __projection: { live: true } } | null>>()
    expect(response1).toBe(null);
    
    
    //Static projection
    const response2 = await dao.user.findFirst({ projection: { firstName: true, live: true, c: true } })
    typeAssert<Test<typeof response2, { firstName?: string | null, live: boolean, __projection: { firstName: true, live: true, c: boolean } } | null>>()
    expect(response2).toBeDefined();
    expect(response2!.firstName).toBe("FirstName");
    expect(response2!.live).toBe(true);

    //Dynamic projection
    const proj: Projection<User> = { firstName: true, live: true }
    const response3 = await dao.user.findFirst({ projection: proj })
    typeAssert<Test<typeof response3, PartialDeep<User> & { __projection: "unknown" } | null>>()
    expect(response3).toBeDefined();
    expect(response3!.firstName).toBe("FirstName");
    expect(response3!.live).toBe(true);

    //Static projection create before
    const proj2 = projection<User>().build({live: true})
    const response7 = await dao.user.findFirst({ projection: proj2 })
    typeAssert<Test<typeof response7, { live: boolean, __projection: { live: true } } | null>>()
    expect(response7).toBeDefined();
    expect(response7!.live).toBe(true);

    //Static projection create before (do not use)
    const proj3: StaticProjection<User> = {live: true}
    const response8 = await dao.user.findFirst({ projection: proj3 })
    //typeAssert<Test<typeof response8, {} | null >>()
    expect(response8).toBeDefined();

    //Whole object
    const response4 = await dao.user.findFirst({ projection: true })
    typeAssert<Test<typeof response4, User & { __projection: "all" } | null>>()
    expect(response4).toBeDefined();
    expect(response4!.firstName).toBe("FirstName");
    expect(response4!.live).toBe(true);

    //No projection
    const response5 = await dao.user.findFirst({})
    typeAssert<Test<typeof response5, User & { __projection: "all" } | null>>()
    expect(response5).toBeDefined();
    expect(response5!.firstName).toBe("FirstName");
    expect(response5!.live).toBe(true);

    //Info to projection
    const response6 = await dao.user.findFirst<Projection<User>>({ projection: true })
    typeAssert<Test<typeof response6, User  & { __projection: "all" } | PartialDeep<User> & { __projection: "unknown" } | null>>()
    expect(response6).toBeDefined();
    expect(response6!.firstName).toBe("FirstName");
    expect(response6!.live).toBe(true);
});

/*test("safe find (undefined)", async () => {
    await dao.user.insert({ id: "u1", firstName: "FirstName", lastName: "LastName", live: true });

    const requiredProjection = projection<CustomerUser>().build({
      firstName: true,
      lastName: true,
      organization: {
        id: true,
        customerUsersId: true,
        customerUsers: { firstName: true, title: true, organization: { id: true } },
      },
    });
    function test(u: ParamProjection<CustomerUser, typeof requiredProjection>) {
      console.log(u.firstName);
    }

    const u1 = await dao.customerUser.findOne({ }, {
        firstName: true,
        lastName: true,
        organization: {
          id: true,
          customerUsersId: true,
          customerUsers: { firstName: true, title: true, organization: { id: true } },
        },
      });
    if (u1) {
      test(u1)
    }

    const u2 = await dao.customerUser.findOne({ }, {
        firstName: true,
        lastName: true,
        organization: {
          id: true,
          customerUsersId: true,
          customerUsers: { firstName: true, organization: { id: true } },
        },
      });
    if (u2) { 
      //@ts-ignore
      test(u2)
    }

    const u3 = await dao.customerUser.findOne({ }, {
        firstName: true,
        lastName: true,
        organization: true,
      });
    if (u3) {
      //@ts-ignore
      test(u3)
    }

    let u4 = await dao.customerUser.findOne({ }, true);
    if (u4) {
      //@ts-ignore
      test(u4)
      test(u4 as CustomerUser)
    }

    const u5 = await dao.customerUser.findOne({ }, {
        firstName: true,
        lastName: true,
        organization: {
          id: true,
          customerUsersId: true,
          customerUsers: { firstName: true, lastName: true, title: true, organization: { id: true } },
        },
      });
    if (u5) {
      test(u5)
    }
})*/



test("update with undefined", async () => {
    const user = await dao.user.insert({
      id: "u1",
      firstName: "FirstName",
      lastName: "LastName",
      live: true,
    })
    await dao.user.updateOne({ filter: { id: user.id }, changes: { live: undefined } });
    const user2 = await dao.user.findFirst({ filter: { id: user.id }, projection: { live: true } });
    expect(user2?.live).toBe(true);
})

/*test("Find with circular reference", async () => {
    await dao.customerUser.insert({ 
        id: "u1",
        firstName: "FirstName",
        lastName: "LastName",
        organizationId: "o1",
        live: true
    })
    await dao.organization.insert({ id: "o1", name: "Org", customerUsersId: ["u1"] })
    const found1 = await dao.organization.find({ id:"o1" }, { name: true, customerUsersId: true, customerUsers: { firstName: true } })
    const found2 = await dao.organization.find({ id:"o1" }, { name: true, customerUsersId: true, customerUsers: true })
    const found3 = await dao.organization.find({ id:"o1" }, { name: true, customerUsersId: true, customerUsers: { organization: true } })
    expect(found1[0].customerUsers![0].firstName).toBe("FirstName")
    expect(found2[0].customerUsers![0].lastName).toBe("LastName")
    expect(found2[0].customerUsers![0].organization).toBe(undefined)
    expect(found2[0].customerUsers![0].organizationId).toBe("o1")
    expect(found3[0].customerUsers![0].organization?.name).toBe("Org")
})*/

afterAll(async (done) => {
    await mongoose.connection.close();
    await mockMongoose.killMongo();
    await done();
})
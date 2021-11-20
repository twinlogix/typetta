import { TsMongooseAbstractGenerator } from './abstractGenerator'
import { TsMongooseGeneratorField, TsMongooseGeneratorNode } from '../generator'
import { DEFAULT_MONGOOSE_SCALARS } from '../mongooseScalars'

export class TsMongooseSchemaGenerator extends TsMongooseAbstractGenerator {
  public generateImports(): string[] {
    const customSchemaRegistrations = []
    if (typeof this._config.mongooseScalars !== 'string') {
      for (let msKey in this._config.mongooseScalars) {
        if (!DEFAULT_MONGOOSE_SCALARS[msKey]) {
          const [schemaName, schemaImport] = this._config.mongooseScalars[msKey].split(' from ')
          if (schemaImport) {
            // custom mongoose scalar
            customSchemaRegistrations.push(`import { ${schemaName} } from "${schemaImport}";`)
            customSchemaRegistrations.push(`(Schema.Types as any).${schemaName} = ${schemaName};`)
          }
        }
      }
    }

    return [
      "import { Schema, model, Connection } from 'mongoose';",
      ...customSchemaRegistrations,
      `import * as types from '${this._tsTypesImport}';`,
      `import { ${this._objectId.identifier} } from '${this._objectId.module}';`,
    ]
  }

  public generateDefinition(node: TsMongooseGeneratorNode, typesMap: Map<String, TsMongooseGeneratorNode>): string {
    if (node.isEntity) {
      const schemaDefinition = `export const ${node.name}Schema : Schema = new Schema(${this._generateFields(node.fields, typesMap, [node.code])}, {collection: '${node.collection}'});`
      return [schemaDefinition].join('\n')
    } else {
      return ''
    }
  }

  public generateExports(typesMap: Map<String, TsMongooseGeneratorNode>): string[] {
    return []
  }

  private _generateFields(fields: TsMongooseGeneratorField[], typesMap: Map<String, TsMongooseGeneratorNode>, chain: string[]) {
    let fieldsRepresentations = fields
      .filter((field) => (typeof field.type === 'string' || field.type.embed) && !field.isExcluded)
      .map((field) => {
        let fieldDeclaration

        if (typeof field.type === 'string') {
          if (field.isID) {
            fieldDeclaration = `{ type: ${field.mongooseType.split(' from ')[0]}, required: true, default: ${this._objectId.identifier} }`
          } else {
            fieldDeclaration = `{ type: ${field.mongooseType.split(' from ')[0]}, required: ${field.required} }`
          }
        } else if (field.type.embed) {
          const subDocumentType = typesMap.get(field.type.embed)
          if (!subDocumentType) {
            throw new Error(`Embedded type not found: ${field.type.embed}`)
          }
          if (chain.includes(subDocumentType.code)) {
            throw new Error('Recursive chain of embedded entities found: ' + [...chain, subDocumentType.code].join(' -> '))
          }
          const embeddedFieldDeclaration = this._generateFields(subDocumentType.fields, typesMap, [...chain, subDocumentType.code])
          const schemaBody = this.indentMultiline(embeddedFieldDeclaration + ',\n{ _id: false }')
          const schemaDeclaration = this.indentMultiline(`type: new Schema(\n${schemaBody}\n),\n` + `required: ${field.required}`)
          fieldDeclaration = '{\n' + schemaDeclaration + '\n}'
        }
        if (field.isList) {
          fieldDeclaration = `[${fieldDeclaration}]`
        }
        return this.indentMultiline(`${field.name}: ${fieldDeclaration},`)
      })
    return `{\n${fieldsRepresentations.filter((fr) => fr !== '').join('\n')}\n}`
  }
}

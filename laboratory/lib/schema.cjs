const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const schemasDir = path.join(__dirname, '..', '..', 'certification', 'schemas');

const schemas = {
  dsse: null,
  intoto: null,
  slsa: null,
  manifest: null
};

function loadSchema(name, file) {
  if (!schemas[name]) {
    const fp = path.join(schemasDir, file);
    if (fs.existsSync(fp)) {
      schemas[name] = JSON.parse(fs.readFileSync(fp, 'utf8'));
      ajv.addSchema(schemas[name], name);
    } else {
      throw new Error(`Schema file not found: ${fp}`);
    }
  }
}

function validateAgainstSchema(object, schemaName, schemaFile) {
  try {
    loadSchema(schemaName, schemaFile);
    const validate = ajv.getSchema(schemaName);
    const valid = validate(object);
    if (!valid) {
      const errors = validate.errors.map(e => `${e.instancePath} ${e.message}`);
      return { valid: false, errors };
    }
    return { valid: true, errors: [] };
  } catch (err) {
    return { valid: false, errors: [err.message] };
  }
}

function validateManifest(manifest) {
  return validateAgainstSchema(manifest, 'manifest', 'manifest.schema.json');
}

function validateDsse(dsseEnvelope) {
  return validateAgainstSchema(dsseEnvelope, 'dsse', 'dsse.schema.json');
}

function validateInTotoStatement(statement) {
  return validateAgainstSchema(statement, 'intoto', 'intoto-statement.schema.json');
}

function validateSlsaProvenance(provenance) {
  return validateAgainstSchema(provenance, 'slsa', 'slsa-provenance.schema.json');
}

module.exports = {
  validateManifest,
  validateDsse,
  validateInTotoStatement,
  validateSlsaProvenance
};

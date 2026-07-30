# Blueprint DSL CBS (Cognitive Bytecode System)

Le module CBS fournit un système de bytecode cognitif pour le compilateur Blueprint V3.

## Composants

### Opcode Table (`opcode-table.ts`)
- `Opcode` - Énumération de tous les opcodes du jeu d'instructions
- `OpcodeInfo` - Informations sur un opcode (nom, description, effet de pile, etc.)
- `OpcodeTable` - Table des opcodes avec méthodes de requête
- Opérations arithmétiques (ADD, SUB, MUL, DIV, MOD, NEG)
- Opérations bit à bit (AND, OR, XOR, NOT, SHL, SHR)
- Opérations de comparaison (EQ, NE, LT, GT, LE, GE)
- Contrôle de flux (JMP, JZ, JNZ, CALL, RET, TAILCALL)
- Opérations de pile (PUSH, POP, DUP, SWAP, PICK, ROLL)
- Opérations de mémoire (LOAD, STORE, LOAD_CONST, LOAD_GLOBAL, STORE_GLOBAL)
- Opérations de registre (MOV, MOV_REG, MOV_MEM, MOV_REG_MEM)
- Opérations cognitives (COGNITIVE_REASONING, COGNITIVE_INFERENCE, etc.)
- Opérations de provider (PROVIDER_CALL, PROVIDER_ASYNC, PROVIDER_STREAM)
- Opérations de type (CAST, TYPEOF, INSTANCEOF)
- Opérations de tableau (NEW_ARRAY, GET_ARRAY, SET_ARRAY, ARRAY_LENGTH)
- Opérations d'objet (NEW_OBJECT, GET_PROPERTY, SET_PROPERTY, DELETE_PROPERTY)
- Opérations de chaîne (CONCAT, SUBSTRING, STRING_LENGTH)
- Opérations d'exception (THROW, CATCH, FINALLY)
- Opérations de debug (DEBUG_BREAK, DEBUG_PRINT, DEBUG_TRACE)
- Opérations méta (NOP, HALT)

### Instruction Table (`instruction-table.ts`)
- `Instruction` - Structure d'instruction bytecode
- `InstructionEncoding` - Encodage d'une instruction
- `OperandType` - Types d'opérandes (IMMEDIATE_8, IMMEDIATE_16, etc.)
- `InstructionTable` - Table des encodages d'instructions
- Encodage d'instructions en bytes
- Décodage d'instructions depuis bytes
- Calcul de taille d'instruction

### Register Table (`register-table.ts`)
- `Register` - Énumération des registres virtuels
- `RegisterInfo` - Informations sur un registre
- `RegisterTable` - Table des registres
- Registres à usage général (R0-R15)
- Registres à usage spécial (SP, FP, PC, SR, TR)
- Registres cognitifs (CR0-CR3)
- Registres de provider (PR0-PR2)
- Registres de debug (DR0-DR2)
- Registres caller-saved et callee-saved

### Instruction Encoder (`instruction-encoder.ts`)
- `InstructionEncoder` - Encodeur d'instructions IR vers bytecode
- `EncodingContext` - Contexte d'encodage (constant pool, function table, label table)
- Mapping des types d'instructions IR vers opcodes
- Encodage des opérandes
- Gestion des constantes, fonctions et labels

### Instruction Decoder (`instruction-decoder.ts`)
- `InstructionDecoder` - Décodeur de bytecode vers instructions IR
- `DecodingContext` - Contexte de décodage
- Mapping des opcodes vers types d'instructions IR
- Décodage des opérandes
- Reconstruction des instructions IR

### Binary Serializer (`binary-serializer.ts`)
- `BinarySerializer` - Sérialiseur binaire
- `BinaryHeader` - En-tête binaire (magic, version, flags, section count)
- `BinarySection` - Section binaire (type, offset, size, data)
- `SectionType` - Types de sections (CODE, CONSTANTS, FUNCTIONS, DEBUG, METADATA, EXCEPTIONS)
- Sérialisation de bytecode en format binaire
- Désérialisation de format binaire vers bytecode
- Création de sections (code, constants, functions, metadata, exception)

### Package Loader (`package-loader.ts`)
- `PackageLoader` - Chargeur de packages bytecode
- `Package` - Structure de package (header, sections, metadata)
- `PackageMetadata` - Métadonnées de package (name, version, dependencies, exports, entryPoint)
- Chargement depuis données binaires
- Cache de packages
- Validation de packages
- Extraction de sections
- Statistiques de package

### Package Linker (`package-linker.ts`)
- `PackageLinker` - Linker de packages
- `LinkResult` - Résultat de linkage
- `LinkSymbol` - Symbole de linkage
- `SymbolType` - Types de symboles (FUNCTION, GLOBAL, CONSTANT)
- Collection de symboles depuis packages
- Résolution des dépendances
- Fusion de multiples packages
- Ajustement des offsets
- Détection de symboles non résolus

### Bytecode Validator (`bytecode-validator.ts`)
- `BytecodeValidator` - Validateur de bytecode
- `ValidationResult` - Résultat de validation
- `ValidationError` - Erreur de validation
- `ValidationWarning` - Avertissement de validation
- `ValidationStatistics` - Statistiques de validation
- Validation de structure bytecode
- Validation des effets de pile
- Validation des cibles de branchement
- Validation des cibles d'appel
- Détection de code inaccessible
- Détection de sous-overflow/overflow de pile

## Utilisation

### Encodage d'instructions
```typescript
import { InstructionEncoder } from './compiler/cbs';

const encoder = new InstructionEncoder();
const bytecode = encoder.encode(irInstruction);
```

### Décodage d'instructions
```typescript
import { InstructionDecoder } from './compiler/cbs';

const decoder = new InstructionDecoder();
const { instruction, nextOffset } = decoder.decode(bytecode, offset);
```

### Chargement de package
```typescript
import { PackageLoader } from './compiler/cbs';

const loader = new PackageLoader();
const package = loader.loadFromBinary(binaryData);
```

### Linkage de packages
```typescript
import { PackageLinker } from './compiler/cbs';

const linker = new PackageLinker();
const result = linker.link([package1, package2]);
```

### Validation de bytecode
```typescript
import { BytecodeValidator } from './compiler/cbs';

const validator = new BytecodeValidator();
const result = validator.validate(bytecode);
```

## Format Binaire

### En-tête
- Magic: 4 octets ('BLUE')
- Version: 4 octets
- Flags: 4 octets
- Section Count: 4 octets

### Table des Sections
Pour chaque section:
- Type: 4 octets
- Offset: 4 octets
- Size: 4 octets

### Types de Sections
- CODE (0x01) - Bytecode exécutable
- CONSTANTS (0x02) - Pool de constantes
- FUNCTIONS (0x03) - Table des fonctions
- DEBUG (0x04) - Informations de debug
- METADATA (0x05) - Métadonnées du package
- EXCEPTIONS (0x06) - Table des exceptions

## Registres Virtuels

### Usage Général (R0-R15)
- R0-R7: Caller-saved (temporaires)
- R8-R15: Callee-saved (préservés)

### Usage Spécial
- SP (16): Stack Pointer
- FP (17): Frame Pointer
- PC (18): Program Counter
- SR (19): Status Register
- TR (20): Temporary Register

### Cognitifs
- CR0 (21): Cognitive Reasoning Register
- CR1 (22): Cognitive Inference Register
- CR2 (23): Cognitive Knowledge Register
- CR3 (24): Cognitive Memory Register

### Provider
- PR0 (25): Provider Result Register
- PR1 (26): Provider Status Register
- PR2 (27): Provider Context Register

### Debug
- DR0 (28): Debug Breakpoint Register
- DR1 (29): Debug Trace Register
- DR2 (30): Debug Profile Register

## Effets de Pile

Chaque instruction a un effet de pile qui indique combien d'éléments sont poussés (+) ou dépilés (-):
- Opérations arithmétiques: -1 (2 opérandes consommés, 1 résultat produit)
- PUSH: +1
- POP: -1
- DUP: +1
- CALL: -1 (adresse consommée)
- RET: +1 (valeur de retour produite)

## Validation

Le validateur vérifie:
- Opcodes valides
- Effets de pile corrects
- Cibles de branchement valides
- Cibles d'appel valides
- Absence de sous-overflow/overflow de pile
- Code inaccessible (dead code)
- Symboles non résolus

## Statistiques

Le validateur collecte:
- Nombre total d'instructions
- Nombre d'instructions valides/invalides
- Nombre d'instructions de branchement
- Nombre d'instructions d'appel
- Nombre d'instructions de retour
- Profondeur de pile actuelle/maximale

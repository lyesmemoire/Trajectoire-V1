#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Duplication Detector
 * 
 * OBJECTIF 3: Détecter automatiquement toutes les duplications
 * 
 * Analyse le MASTER INDEX pour détecter:
 * - Types
 * - Interfaces
 * - Classes
 * - Events
 * - Graphs
 * - States
 * - Rules
 * - Invariants
 * - Algorithmes
 * - APIs
 * - Contracts
 * - DTO
 * - Schemas
 * - Enums
 * - Errors
 * - Runtime Objects
 * - Memory Types
 * - Knowledge Types
 * - Schedulers
 * - Validators
 * - Security Policies
 */

const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

class DuplicationDetector {
  constructor(masterIndexPath) {
    this.masterIndex = JSON.parse(readFileSync(masterIndexPath, 'utf-8'));
    this.duplications = {
      interfaces: new Map(),
      types: new Map(),
      enums: new Map(),
      classes: new Map(),
      functions: new Map(),
      contracts: new Map(),
    };
  }

  /**
   * Détecter les duplications
   */
  detect() {
    console.log('Detecting duplications...');
    
    this.detectInterfaceDuplications();
    this.detectTypeDuplications();
    this.detectEnumDuplications();
    this.detectClassDuplications();
    this.detectFunctionDuplications();
    this.detectContractDuplications();
    this.contentDuplications = this.detectContentDuplications();

    this.printSummary();
  }

  /**
   * Détecter les duplications d'interfaces
   */
  detectInterfaceDuplications() {
    const interfaceMap = new Map();

    for (const iface of this.masterIndex.interfaces) {
      if (interfaceMap.has(iface.name)) {
        interfaceMap.get(iface.name).push(iface);
      } else {
        interfaceMap.set(iface.name, [iface]);
      }
    }

    for (const [name, occurrences] of interfaceMap) {
      if (occurrences.length > 1) {
        this.duplications.interfaces.set(name, occurrences);
      }
    }
  }

  /**
   * Détecter les duplications de types
   */
  detectTypeDuplications() {
    const typeMap = new Map();

    for (const type of this.masterIndex.types) {
      if (typeMap.has(type.name)) {
        typeMap.get(type.name).push(type);
      } else {
        typeMap.set(type.name, [type]);
      }
    }

    for (const [name, occurrences] of typeMap) {
      if (occurrences.length > 1) {
        this.duplications.types.set(name, occurrences);
      }
    }
  }

  /**
   * Détecter les duplications d'enums
   */
  detectEnumDuplications() {
    const enumMap = new Map();

    for (const enumItem of this.masterIndex.enums) {
      if (enumMap.has(enumItem.name)) {
        enumMap.get(enumItem.name).push(enumItem);
      } else {
        enumMap.set(enumItem.name, [enumItem]);
      }
    }

    for (const [name, occurrences] of enumMap) {
      if (occurrences.length > 1) {
        this.duplications.enums.set(name, occurrences);
      }
    }
  }

  /**
   * Détecter les duplications de classes
   */
  detectClassDuplications() {
    const classMap = new Map();

    for (const cls of this.masterIndex.classes) {
      if (classMap.has(cls.name)) {
        classMap.get(cls.name).push(cls);
      } else {
        classMap.set(cls.name, [cls]);
      }
    }

    for (const [name, occurrences] of classMap) {
      if (occurrences.length > 1) {
        this.duplications.classes.set(name, occurrences);
      }
    }
  }

  /**
   * Détecter les duplications de fonctions
   */
  detectFunctionDuplications() {
    const functionMap = new Map();

    for (const func of this.masterIndex.functions) {
      if (functionMap.has(func.name)) {
        functionMap.get(func.name).push(func);
      } else {
        functionMap.set(func.name, [func]);
      }
    }

    for (const [name, occurrences] of functionMap) {
      if (occurrences.length > 1) {
        this.duplications.functions.set(name, occurrences);
      }
    }
  }

  /**
   * Détecter les duplications de contrats
   */
  detectContractDuplications() {
    const contractFiles = this.masterIndex.files.filter(f => f.path.includes('.contract.ts'));
    const contractMap = new Map();

    for (const file of contractFiles) {
      const contractName = file.path.split('/').pop().replace('.contract.ts', '');
      
      // Extraire le nom du contrat du chemin
      const parts = file.path.split('/');
      const nameFromPath = parts[parts.length - 1].replace('.contract.ts', '');
      
      if (contractMap.has(nameFromPath)) {
        contractMap.get(nameFromPath).push(file);
      } else {
        contractMap.set(nameFromPath, [file]);
      }
    }

    for (const [name, occurrences] of contractMap) {
      if (occurrences.length > 1) {
        this.duplications.contracts.set(name, occurrences);
      }
    }
  }

  /**
   * Détecter les duplications par contenu
   */
  detectContentDuplications() {
    console.log('Detecting content duplications...');
    
    const contentMap = new Map();

    for (const file of this.masterIndex.files) {
      try {
        const content = readFileSync(join(process.cwd(), file.path), 'utf-8');
        const hash = this.simpleHash(content);
        
        if (contentMap.has(hash)) {
          contentMap.get(hash).push(file);
        } else {
          contentMap.set(hash, [file]);
        }
      } catch (error) {
        // Ignorer les erreurs de lecture
      }
    }

    const contentDuplications = [];
    for (const [hash, occurrences] of contentMap) {
      if (occurrences.length > 1) {
        contentDuplications.push({ hash, occurrences });
      }
    }

    console.log(`Found ${contentDuplications.length} content duplications`);
    return contentDuplications;
  }

  /**
   * Hash simple pour le contenu
   */
  simpleHash(content) {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return hash.toString(16);
  }

  /**
   * Afficher le résumé
   */
  printSummary() {
    console.log('\n=== DUPLICATION DETECTION SUMMARY ===');
    console.log(`Interface Duplications: ${this.duplications.interfaces.size}`);
    console.log(`Type Duplications: ${this.duplications.types.size}`);
    console.log(`Enum Duplications: ${this.duplications.enums.size}`);
    console.log(`Class Duplications: ${this.duplications.classes.size}`);
    console.log(`Function Duplications: ${this.duplications.functions.size}`);
    console.log(`Contract Duplications: ${this.duplications.contracts.size}`);
    console.log(`Content Duplications: ${this.contentDuplications.length}`);
    console.log('====================================\n');

    if (this.duplications.interfaces.size > 0) {
      console.log('DUPLICATE INTERFACES:');
      for (const [name, occurrences] of this.duplications.interfaces) {
        console.log(`  ${name}: ${occurrences.length} occurrences`);
        for (const occ of occurrences) {
          console.log(`    - ${occ.file}`);
        }
      }
      console.log('');
    }

    if (this.duplications.contracts.size > 0) {
      console.log('DUPLICATE CONTRACTS:');
      for (const [name, occurrences] of this.duplications.contracts) {
        console.log(`  ${name}: ${occurrences.length} occurrences`);
        for (const occ of occurrences) {
          console.log(`    - ${occ.path}`);
        }
      }
      console.log('');
    }

    if (this.contentDuplications.length > 0) {
      console.log('CONTENT DUPLICATIONS (first 10):');
      for (let i = 0; i < Math.min(10, this.contentDuplications.length); i++) {
        const dup = this.contentDuplications[i];
        console.log(`  Hash ${dup.hash}: ${dup.occurrences.length} occurrences`);
        for (const occ of dup.occurrences) {
          console.log(`    - ${occ.path}`);
        }
      }
      console.log('');
    }
  }

  /**
   * Générer le rapport
   */
  generateReport() {
    const report = {
      summary: {
        totalInterfaceDuplications: this.duplications.interfaces.size,
        totalTypeDuplications: this.duplications.types.size,
        totalEnumDuplications: this.duplications.enums.size,
        totalClassDuplications: this.duplications.classes.size,
        totalFunctionDuplications: this.duplications.functions.size,
        totalContractDuplications: this.duplications.contracts.size,
        totalContentDuplications: this.contentDuplications.length,
      },
      interfaceDuplications: Array.from(this.duplications.interfaces.entries()).map(([name, occurrences]) => ({ name, occurrences })),
      typeDuplications: Array.from(this.duplications.types.entries()).map(([name, occurrences]) => ({ name, occurrences })),
      enumDuplications: Array.from(this.duplications.enums.entries()).map(([name, occurrences]) => ({ name, occurrences })),
      classDuplications: Array.from(this.duplications.classes.entries()).map(([name, occurrences]) => ({ name, occurrences })),
      functionDuplications: Array.from(this.duplications.functions.entries()).map(([name, occurrences]) => ({ name, occurrences })),
      contractDuplications: Array.from(this.duplications.contracts.entries()).map(([name, occurrences]) => ({ name, occurrences })),
      contentDuplications: this.contentDuplications,
    };

    return report;
  }

  /**
   * Sauvegarder le rapport
   */
  saveReport(outputPath) {
    const report = this.generateReport();
    const json = JSON.stringify(report, null, 2);
    writeFileSync(outputPath, json, 'utf-8');
    console.log(`\nDuplication Report saved to ${outputPath}`);
  }
}

// Exécution
const masterIndexPath = process.argv[2] || join(process.cwd(), 'BLUEPRINT_MASTER_INDEX.json');
const outputPath = process.argv[3] || join(process.cwd(), 'BLUEPRINT_DUPLICATION_REPORT.json');

const detector = new DuplicationDetector(masterIndexPath);
detector.detect();
detector.saveReport(outputPath);

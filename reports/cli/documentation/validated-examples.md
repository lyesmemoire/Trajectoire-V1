# Documentation Examples Validation Report

**Generated:** 2026-07-25T20:51:30.992Z
**Platform:** win32 x64
**Node Version:** v24.13.0

## Summary

- **Total Examples:** 4
- **Passed:** 4
- **Failed:** 0
- **Pass Rate:** 100.00%

## Results

### Display help information

**Command:** `npx tsx bin/blueprint --help`

**Exit Code:** 0
**Duration:** 2945ms
**Status:** ✓ PASS

**Stdout:**
```
Usage: blueprint [options] [command]

Blueprint V3 Enterprise - Cognitive Platform CLI

Options:
  -V, --version        output the version number
  -v, --verbose        Enable verbose output
  -q, --quiet          Suppress output
  --json               Output in JSON format
  -c, --config <path>  Path to configuration file
  -h, --help           display help for command

Commands:
  init [options]       Initialize a new Blueprint project
  compile [options]    Compile Blueprint DSL to bytecode
 ...
```

---

### Display version information

**Command:** `npx tsx bin/blueprint --version`

**Exit Code:** 0
**Duration:** 3765ms
**Status:** ✓ PASS

**Stdout:**
```
1.0.0
```

---

### Check system health

**Command:** `npx tsx bin/blueprint doctor`

**Exit Code:** 0
**Duration:** 3606ms
**Status:** ✓ PASS

**Stdout:**
```
[20:51:27] [32mINFO[39m: [36mRunning health checks...[39m
[20:51:27] [32mINFO[39m: [36mHealth checks completed: 6 healthy, 7 warning, 0 critical[39m
[20:51:27] [32mINFO[39m: [36m✓ Doctor completed in 3ms[39m
    [35msuccess[39m: true
```

---

### Check system health with JSON output

**Command:** `npx tsx bin/blueprint doctor --json`

**Exit Code:** 0
**Duration:** 3351ms
**Status:** ✓ PASS

**Stdout:**
```
[20:51:30] [32mINFO[39m: [36mRunning health checks...[39m
[20:51:30] [32mINFO[39m: [36mHealth checks completed: 6 healthy, 7 warning, 0 critical[39m
[20:51:30] [32mINFO[39m: [36m✓ Doctor completed in 2ms[39m
    [35msuccess[39m: true
```

---


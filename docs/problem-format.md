# COMMIT Problem Format

This document describes the standard format for COMMIT Romania problems.

## Problem Structure

Each problem should be organized in the following directory structure:

```
problems/
└── problem-name/
    ├── statement.md         # Problem statement
    ├── solution.cpp         # Reference solution
    ├── generator.py         # Test case generator (optional)
    ├── tests/
    │   ├── input/
    │   │   ├── 01.txt
    │   │   ├── 02.txt
    │   │   └── ...
    │   └── output/
    │       ├── 01.txt
    │       ├── 02.txt
    │       └── ...
    └── constraints.txt      # Problem constraints
```

## Problem Statement Format

The `statement.md` file should follow this template:

```markdown
# Problem Title

## Problem Description

[Clear description of the problem]

## Input Format

[Description of input format]

## Output Format

[Description of expected output]

## Constraints

- [Constraint 1]
- [Constraint 2]
- ...

## Sample Input
```
[sample input]
```

## Sample Output
```
[sample output]
```

## Explanation

[Optional explanation of the sample]
```

## Test Cases

### Naming Convention

- Input files: `01.txt`, `02.txt`, ..., `10.txt`
- Output files: `01.txt`, `02.txt`, ..., `10.txt`
- Numbers should be zero-padded for proper sorting

### Test Case Categories

1. **Sample cases (01-02)**: Cases from the problem statement
2. **Edge cases (03-05)**: Minimum/maximum values, special conditions
3. **General cases (06-10)**: Representative test cases

## Solution Requirements

- Reference solution should be in C++ for consistency
- Code should be well-commented and efficient
- Time complexity should meet the problem requirements
- Solution should pass all test cases

## Constraints File

The `constraints.txt` file should specify:

```
Time Limit: X seconds
Memory Limit: Y MB
Input Size: N ≤ value
Additional constraints...
```

## Example Problem

See the `examples/` directory for a complete example problem following this format.

## Validation

Use the testing framework to validate:
- Solution correctness on all test cases
- Time and memory limits
- Input/output format compliance
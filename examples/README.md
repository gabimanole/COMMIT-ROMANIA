# COMMIT Romania Examples

This directory contains example problems that demonstrate the COMMIT Romania problem format and structure.

## Available Examples

### Sum Problem (`sum-problem/`)

A simple example that demonstrates:
- Basic problem structure
- Input/output format
- Test case organization
- Solution implementation

**Problem**: Given two integers A and B, calculate their sum.

**Files**:
- `statement.md` - Problem description
- `solution.cpp` - Reference solution
- `constraints.txt` - Problem limits
- `tests/` - Test cases

## Using Examples

### Test an Example

```bash
# From the repository root
./scripts/test_problem.sh examples/sum-problem
```

### Validate an Example

```bash
# From the repository root
./scripts/validate_problem.sh examples/sum-problem
```

### Study the Structure

1. Read the `statement.md` to understand the problem format
2. Examine `solution.cpp` to see implementation style
3. Check `tests/` directory to understand test case format
4. Review `constraints.txt` for limit specifications

## Creating Your Own Problems

Use these examples as references when creating new problems:

1. Follow the same directory structure
2. Use similar formatting in `statement.md`
3. Implement clean, well-commented solutions
4. Create comprehensive test cases
5. Specify appropriate constraints

## Next Steps

- See [problem format documentation](../docs/problem-format.md) for detailed guidelines
- Use `scripts/create_problem.sh` to generate new problem templates
- Read the [testing guide](../docs/testing-guide.md) for testing best practices

Happy problem solving! 🧩
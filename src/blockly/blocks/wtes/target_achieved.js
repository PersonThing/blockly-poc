/*
  WTE_TARGET_ACHIEVED

  Purpose:
    Compares input to target and returns value if target is met

  Inputs:
    x (fixed): Value to compare (decimal.Decimal)
    target (fixed): Target threshold (decimal.Decimal)
    return_value (fixed): Value to return if achieved (decimal.Decimal)
    target_compare (fixed): Comparison operator (string) - ">", ">=", "<", "<="
    target_proration (fixed): Target multiplier (decimal.Decimal)
    return_value_proration (fixed): Return value multiplier (decimal.Decimal)

  Outputs:
    Output: return_value × return_value_proration if achieved, 0 otherwise
    Context: Achievement status and return value
*/
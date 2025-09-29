/*
  WTE_TIER_INTERSECTION

  Purpose:
    Returns tier value when input falls within a threshold range

  Inputs:
    x (fixed): Input value to evaluate (decimal.Decimal)
    thresholds (fixed): Array of [min, max, value] triplets ([][]*decimal.Decimal)
    return_value_proration (fixed): Multiplier for return values (decimal.Decimal)
    min_max_proration (fixed): Multiplier for threshold boundaries (decimal.Decimal)
    min_inclusive (fixed): Whether minimum threshold is inclusive (bool)

  Outputs:
    Output: Tier value if match found, 0 otherwise
    Context: min, max, value of matching tier
*/
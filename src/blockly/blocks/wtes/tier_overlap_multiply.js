/*
  WTE_TIER_OVERLAP_MULTIPLY

  Purpose:
    Calculates overlapping tier contributions (progressive taxation style)

  Inputs:
    x (fixed): Input value to evaluate (decimal.Decimal)
    thresholds (fixed): Array of [min, max, rate] triplets ([][]*decimal.Decimal)
    return_value_proration (fixed): Multiplier for rates (decimal.Decimal)
    min_max_proration (fixed): Multiplier for thresholds (decimal.Decimal)

  Outputs:
    Output: Sum of contributions from all applicable tiers
*/
// sample jackson comp model - using our json serializer
// TODO: make importable
export default [
  [
    {
      "type": "define_wte",
      "value": {
        "name": "clinical_base",
        "output": {
          "type": "sum",
          "values": [
            {
              "type": "multiply",
              "values": [
                {
                  "type": "context_variable",
                  "value": "sc_median_benchmark"
                },
                {
                  "type": "context_variable",
                  "value": "cfte"
                }
              ]
            },
            {
              "type": "context_variable",
              "value": "clinical_external_dollars"
            }
          ]
        }
      }
    },
    {
      "type": "define_wte",
      "value": {
        "name": "clinical_incentive",
        "output": {
          "type": "conditional_number",
          "left": {
            "type": "context_variable",
            "value": "prior_year_rvu_total"
          },
          "operator": "less_than",
          "right": {
            "type": "context_variable",
            "value": "cfte_adjusted_rvu_50"
          },
          "true_value": {
            "type": "number",
            "value": 0
          },
          "false_value": {
            "type": "conditional_number",
            "left": {
              "type": "sum",
              "values": [
                {
                  "type": "context_variable",
                  "value": "jup_cfte"
                },
                {
                  "type": "context_variable",
                  "value": "clinical_external_fte"
                }
              ]
            },
            "operator": "less_than",
            "right": {
              "type": "number",
              "value": 0.5
            },
            "true_value": {
              "type": "multiply",
              "values": [
                {
                  "type": "subtract",
                  "values": [
                    {
                      "type": "min",
                      "values": [
                        {
                          "type": "context_variable",
                          "value": "prior_year_rvu_total"
                        },
                        {
                          "type": "context_variable",
                          "value": "cfte_adjusted_rvu_90"
                        }
                      ]
                    },
                    {
                      "type": "context_variable",
                      "value": "cfte_adjusted_rvu_50"
                    }
                  ]
                },
                {
                  "type": "context_variable",
                  "value": "base_comp_per_wrvu"
                },
                {
                  "type": "number",
                  "value": 0.85
                }
              ]
            },
            "false_value": {
              "type": "multiply",
              "values": [
                {
                  "type": "max",
                  "values": [
                    {
                      "type": "subtract",
                      "values": [
                        {
                          "type": "context_variable",
                          "value": "prior_year_rvu_total"
                        },
                        {
                          "type": "context_variable",
                          "value": "cfte_adjusted_rvu_60"
                        }
                      ]
                    },
                    {
                      "type": "number",
                      "value": 0
                    }
                  ]
                },
                {
                  "type": "context_variable",
                  "value": "base_comp_per_wrvu"
                },
                {
                  "type": "number",
                  "value": 0.85
                }
              ]
            }
          }
        }
      }
    },
    {
      "type": "define_wte",
      "value": {
        "name": "academic_base",
        "output": {
          "type": "sum",
          "values": [
            {
              "type": "context_variable",
              "value": "external_contract_cfte"
            },
            {
              "type": "context_variable",
              "value": "gme_admin_dollars"
            },
            {
              "type": "context_variable",
              "value": "academic_service_time_dollars"
            },
            {
              "type": "context_variable",
              "value": "dept_other_admin_dollars"
            },
            {
              "type": "context_variable",
              "value": "other_clinical_admin_dollars"
            },
            {
              "type": "context_variable",
              "value": "direct_gme"
            },
            {
              "type": "context_variable",
              "value": "direct_ume"
            },
            {
              "type": "context_variable",
              "value": "ext_funded_research"
            },
            {
              "type": "context_variable",
              "value": "internal_research"
            }
          ]
        }
      }
    },
    {
      "type": "define_wte",
      "value": {
        "name": "quality_incentive",
        "output": {
          "type": "multiply",
          "values": [
            {
              "type": "conditional_number",
              "left": {
                "type": "context_variable",
                "value": "prior_year_rvu_total"
              },
              "operator": "greater_than",
              "right": {
                "type": "multiply",
                "values": [
                  {
                    "type": "context_variable",
                    "value": "cfte_adjusted_rvu_50"
                  },
                  {
                    "type": "number",
                    "value": 0.9
                  }
                ]
              },
              "true_value": {
                "type": "multiply",
                "values": [
                  {
                    "type": "subtract",
                    "values": [
                      {
                        "type": "context_variable",
                        "value": "sc_60_percentile_benchmark"
                      },
                      {
                        "type": "context_variable",
                        "value": "sc_median_benchmark"
                      }
                    ]
                  },
                  {
                    "type": "context_variable",
                    "value": "jup_cfte"
                  }
                ]
              },
              "false_value": {
                "type": "number",
                "value": 0
              }
            },
            {
              "type": "context_variable",
              "value": "payout_cap"
            }
          ]
        }
      }
    },
    {
      "type": "define_wte",
      "value": {
        "name": "total_comp",
        "output": {
          "type": "sum",
          "values": [
            {
              "type": "call_wte",
              "value": {
                "name": "clinical_base"
              }
            },
            {
              "type": "call_wte",
              "value": {
                "name": "academic_base"
              }
            },
            {
              "type": "context_variable",
              "value": "rank_recognition"
            },
            {
              "type": "call_wte",
              "value": {
                "name": "clinical_incentive"
              }
            },
            {
              "type": "call_wte",
              "value": {
                "name": "quality_incentive"
              }
            }
          ]
        }
      }
    },
    {
      "type": "call_wte",
      "value": {
        "name": "total_comp"
      }
    }
  ]
]
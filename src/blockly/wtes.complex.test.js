import { describe, it, expect } from 'vitest';
import wtes from './wtes.js';

const jacksonContext = {
  aamc_assistant_prof_comp_median: 321887,
  aamc_associate_prof_comp_median: 384555,
  academic_service_time_dollars: 0,
  base_comp_per_wrvu: 56.42,
  cfte_adjusted_rvu_50: 4751,
  cfte_adjusted_rvu_60: 5203,
  cfte_adjusted_rvu_90: 6939,
  cfte: 0.65,
  clinical_external_dollars: 0,
  clinical_external_fte: 0,
  dept_other_admin_dollars: 57683,
  direct_gme: 19228,
  direct_ume: 0,
  ext_funded_research: 0,
  external_contract_cfte: 0,
  gme_admin_dollars: 0,
  internal_research: 0,
  jup_cfte: 0.65,
  other_clinical_admin_dollars: 57683,
  payout_cap: 1,
  prior_year_rvu_total: 6003,
  rank_recognition: 12500,
  sc_60_percentile_benchmark: 464260,
  sc_median_benchmark: 412390,
};

const jacksonComponentWTEs = {
  clinical_base: (context) =>
    wtes.sum(
      wtes.multiply(
        wtes.context_variable(context, 'sc_median_benchmark'),
        wtes.context_variable(context, 'cfte')
      ),
      wtes.context_variable(context, 'clinical_external_dollars')
    ),
  academic_base: (context) =>
    wtes.sum(
      wtes.context_variable(context, 'external_contract_cfte'),
      wtes.context_variable(context, 'gme_admin_dollars'),
      wtes.context_variable(context, 'academic_service_time_dollars'),
      wtes.context_variable(context, 'dept_other_admin_dollars'),
      wtes.context_variable(context, 'other_clinical_admin_dollars'),
      wtes.context_variable(context, 'direct_ume'),
      wtes.context_variable(context, 'direct_gme'),
      wtes.context_variable(context, 'ext_funded_research'),
      wtes.context_variable(context, 'internal_research')
    ),
  clinical_incentive: (context) =>
    wtes.conditional_number(
      wtes.context_variable(context, 'prior_year_rvu_total'), // 6003
      'less_than',
      wtes.context_variable(context, 'cfte_adjusted_rvu_50'), // 4751
      wtes.number(0),
      wtes.conditional_number(
        wtes.sum(
          wtes.context_variable(context, 'jup_cfte'), // 0.65
          wtes.context_variable(context, 'clinical_external_fte') // 0
        ),
        'less_than',
        wtes.number(0.5),
        wtes.multiply(
          wtes.subtract(
            wtes.min(
              wtes.context_variable(context, 'prior_year_rvu_total'), // 6003
              wtes.context_variable(context, 'cfte_adjusted_rvu_90') // 6939
            ),
            wtes.context_variable(context, 'cfte_adjusted_rvu_50') // 4751
          ),
          wtes.context_variable(context, 'base_comp_per_wrvu'), // 56.42
          wtes.number(0.85)
        ),
        wtes.multiply(
          wtes.max(
            wtes.subtract(
              wtes.context_variable(context, 'prior_year_rvu_total'), // 6003
              wtes.context_variable(context, 'cfte_adjusted_rvu_60') // 5203
            ),
            wtes.number(0)
          ),
          wtes.context_variable(context, 'base_comp_per_wrvu'), // 56.42
          wtes.number(0.85)
        )
      )
    ),
  quality_incentive: (context) =>
    wtes.multiply(
      wtes.conditional_number(
        wtes.context_variable(context, 'prior_year_rvu_total'),
        'greater_than',
        wtes.multiply(wtes.context_variable(context, 'cfte_adjusted_rvu_50'), 0.9),
        wtes.multiply(
          wtes.subtract(
            wtes.context_variable(context, 'sc_60_percentile_benchmark'),
            wtes.context_variable(context, 'sc_median_benchmark')
          ),
          wtes.context_variable(context, 'jup_cfte')
        ),
        0
      ),
      wtes.context_variable(context, 'payout_cap')
    ),
};

describe('wte complex model tests', () => {
  const complexModelTests = [
    {
      description: 'tier_overlap_multiply + tier + context_variable',
      run: (context) =>
        wtes.tier_overlap_multiply({
          input: wtes.context_variable(context, 'wrvu'),
          tiers: [
            wtes.tier({
              min: 0,
              max: 100,
              value: wtes.context_variable(context, 'tier1_wrvu_value'),
            }),
            wtes.tier({
              min: 100,
              max: 200,
              value: wtes.context_variable(context, 'tier2_wrvu_value'),
            }),
            wtes.tier({
              min: 200,
              max: 0,
              value: wtes.context_variable(context, 'tier3_wrvu_value'),
            }),
          ],
          return_value_proration: 1,
          min_max_proration: 1,
        }),
      executions: [
        {
          context: { wrvu: 250, tier1_wrvu_value: 5, tier2_wrvu_value: 6, tier3_wrvu_value: 7 },
          expected: 1450, // 100 * 5 + 100 * 6 + 50 * 7 = 500 + 600 + 350 = 1450
        },

        {
          context: { wrvu: 150, tier1_wrvu_value: 2, tier2_wrvu_value: 4, tier3_wrvu_value: 6 },
          expected: 400, // 100 * 2 + 50 * 4 = 200 + 200 = 400
        },

        {
          context: { wrvu: 50, tier1_wrvu_value: 1, tier2_wrvu_value: 2, tier3_wrvu_value: 3 },
          expected: 50, // 50 * 1 = 50
        },

        {
          context: { wrvu: 1000, tier1_wrvu_value: 1, tier2_wrvu_value: 2, tier3_wrvu_value: 3 },
          expected: 2700, // 100 * 1 + 100 * 2 + 800 * 3 = 100 + 200 + 2400 = 2700
        },
      ],
    },

    {
      description: 'conditional_number + multiply + add',
      run: (context) =>
        wtes.conditional_number(
          wtes.context_variable(context, 'value'),
          'greater_than',
          wtes.number(5),
          wtes.multiply(3, 10),
          wtes.sum(1, 2, 3, 4)
        ),
      executions: [
        { context: { value: 10 }, expected: 30 }, // value more than 5, so should get 3 * 10
        { context: { value: 3 }, expected: 10 }, // value less than 5, so should get 1 + 2 + 3 + 4
      ],
    },

    {
      description: 'jackson clinical_base',
      run: jacksonComponentWTEs.clinical_base,
      executions: [
        {
          context: jacksonContext,
          expected: 268053.5,
        },
      ],
    },

    {
      description: 'jackson academic_base',
      run: jacksonComponentWTEs.academic_base,
      executions: [
        {
          context: jacksonContext,
          expected: 134594,
        },
      ],
    },

    {
      description: 'jackson clinical_incentive',
      run: jacksonComponentWTEs.clinical_incentive,
      executions: [
        {
          context: jacksonContext,
          expected: 38365.6,
        },
        {
          context: {
            ...jacksonContext,
            jup_cfte: 0.1,
          },
          expected: 60042.164,
        },
        {
          context: {
            ...jacksonContext,
            prior_year_rvu_total: 4000,
            cfte_adjusted_rvu_50: 4001,
          },
          expected: 0,
        },
      ],
    },

    {
      description: 'jackson total comp',
      run: (context) => {
        wtes.define_wte('clinical_base', jacksonComponentWTEs.clinical_base);
        wtes.define_wte('academic_base', jacksonComponentWTEs.academic_base);
        wtes.define_wte('clinical_incentive', jacksonComponentWTEs.clinical_incentive);
        wtes.define_wte('quality_incentive', jacksonComponentWTEs.quality_incentive);
        return wtes.sum(
          wtes.call_wte('clinical_base', context),
          wtes.call_wte('academic_base', context),
          wtes.context_variable(context, 'rank_recognition'),
          wtes.call_wte('clinical_incentive', context),
          wtes.call_wte('quality_incentive', context)
        );
      },

      executions: [
        {
          context: jacksonContext,
          expected: 487228.6,
        },
      ],
    },
  ];

  complexModelTests.forEach((test, index) => {
    test.executions.forEach((execution, index) => {
      it(`${test.description} : execution ${index + 1}`, () => {
        wtes.reset();
        wtes.context = execution.context;
        const result = test.run(wtes.context);
        if (result !== execution.expected) {
          console.log(`${test.description} : execution ${index + 1}: FAILED, LOGS:`);
          console.log(wtes.logs.reverse());
        }
        expect(result).toBe(execution.expected);
      });
    });
  });
});

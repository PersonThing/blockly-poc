import { describe, it, expect } from 'vitest';
import wtes from './wtes.js';

describe('wte generated model tests', () => {
  const complexModelTests = [
    {
      // tier_overlap_multiply + tier + context_variable
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

    // random conditional_number + multiply + add
    {
      run: (context) =>
        wtes.conditional_number(
          wtes.context_variable(context, 'value') > 5,
          wtes.multiply(3, 10),
          wtes.add(1, 2, 3, 4)
        ),
      executions: [
        { context: { value: 10 }, expected: 30 }, // value more than 5, so should get 3 * 10
        { context: { value: 3 }, expected: 10 }, // value less than 5, so should get 1 + 2 + 3 + 4
      ],
    },
  ];

  complexModelTests.forEach((test, index) => {
    test.executions.forEach((execution) => {
      it(`should execute complex model test ${index + 1} correctly`, () => {
        wtes.reset();
        wtes.context = execution.context;
        const result = test.run(wtes.context);
        expect(result).toBe(execution.expected);
      });
    });
  });
});

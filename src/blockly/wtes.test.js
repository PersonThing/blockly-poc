import { describe, it, expect } from 'vitest';
import wtes from './wtes.js';
import SampleEvents from './mock_data/sample_events.js';

describe('wte tests', () => {
  const arrayMathTests = [
    { mathType: 'COUNT', list: [1, 2, 3], expected: 3 },
    { mathType: 'MAX', list: [1, 2, 3], expected: 3 },
    { mathType: 'MIN', list: [1, 2, 3], expected: 1 },
    { mathType: 'AVERAGE', list: [1, 2, 3], expected: 2 },
    { mathType: 'SUM', list: [1, 2, 3], expected: 6 },
    { mathType: 'MULTIPLY', list: [1, 2, 3], expected: 6 },
    { mathType: 'SUM', list: [], expected: null }, // edge case
    { mathType: 'MULTIPLY', list: [], expected: null }, // edge case
    { mathType: 'UNKNOWN', list: [1, 2, 3], expected: null }, // edge case
  ];

  arrayMathTests.forEach(({ mathType, list, expected }) => {
    it(`arrayMath ${mathType} of [${list}] should be ${expected}`, () => {
      const result = wtes.arrayMath(mathType, list);
      expect(result).toBe(expected);
    });
  });

  it('should define and call a wte correctly', () => {
    const wteName = 'test_wte';
    const outputCallback = (context) => {
      return context.value * 2;
    };

    wtes.define_wte(wteName, outputCallback);

    const contextOverrides = { value: 5 };
    const result = wtes.call_wte(wteName, contextOverrides);
    expect(result).toBe(10);
  });

  it('should return error when calling undefined wte', () => {
    const result = wtes.call_wte('undefined_wte', {});
    expect(result).toBe('wte not defined');
  });

  it('should add numbers correctly', () => {
    const result = wtes.add(1, 2, 3, 4);
    expect(result).toBe(10);
  });

  it('should subtract numbers correctly', () => {
    const result = wtes.subtract(10, 2, 3);
    expect(result).toBe(5);
  });

  it('should make array correctly', () => {
    const result = wtes.make_array(1, 2, 3);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should return conditional number correctly', () => {
    const resultTrue = wtes.conditional_number(true, 1, 0);
    expect(resultTrue).toBe(1);
    const resultFalse = wtes.conditional_number(false, 1, 0);
    expect(resultFalse).toBe(0);
  });

  const sampleSegment = [
    { id: 1, name: 'Alice', wrvu: 300, hours: 30, clinical_fte: 0.5 },
    { id: 2, name: 'Bob', wrvu: 200, hours: 20, clinical_fte: 0.4 },
  ];

  it('should process segment_frame correctly wrvu example', () => {
    const outputCallback = (context) => context.wrvu * 2;
    const result = wtes.segment_frame({}, 'test_segment', sampleSegment, outputCallback);
    expect(result).toEqual([600, 400]);
  });

  it('should process segment_frame correctly hours example', () => {
    const outputCallbackHours = (context) => context.hours + 10;
    const resultHours = wtes.segment_frame({}, 'test_segment', sampleSegment, outputCallbackHours);
    expect(resultHours).toEqual([40, 30]);
  });

  it('should calculate ratio correctly', () => {
    expect(wtes.ratio(10, 2)).toBe(5);
    expect(wtes.ratio(10, 0)).toBe(0); // edge case
  });

  it('should calculate ratio_condition_true correctly', () => {
    const array = [1, 2, 3, 4, 5];
    const conditions = [{ type: 'greater_than', value: 3 }];
    const result = wtes.ratio_condition_true(array, conditions);
    expect(result).toBe(0.4); // 2 out of 5 are > 3
  });

  it('should determine target_achieved correctly', () => {
    const params = {
      input: 10,
      target: 5,
      target_compare: 'greater_than',
      return_value: 100,
      target_proration: 1,
      return_value_proration: 1,
    };
    const result = wtes.target_achieved(params);
    expect(result).toBe(100);

    params.input = 3;
    const resultNotAchieved = wtes.target_achieved(params);
    expect(resultNotAchieved).toBe(0);
  });

  it('should determine target_achieved_excess correctly', () => {
    const params = {
      input: 10,
      target: 5,
      target_compare: 'greater_than',
      return_value: 20,
      target_proration: 1,
      return_value_proration: 1,
    };
    const result = wtes.target_achieved_excess(params);
    expect(result).toBe(100); // excess is 5, 5 * 20 = 100

    params.input = 3;
    const resultNotAchieved = wtes.target_achieved_excess(params);
    expect(resultNotAchieved).toBe(0);
  });

  it('should determine tier_intersection correctly', () => {
    const tiers = [
      { min: 0, max: 10, value: 1 },
      { min: 10, max: 20, value: 2 },
      { min: 20, max: 30, value: 3 },
    ];

    let params = {
      input: 5,
      tiers,
      return_value_proration: 1,
      min_max_proration: 1,
      min_inclusive: false,
    };
    let result = wtes.tier_intersection(params);
    expect(result).toBe(1);

    params.input = 10;
    result = wtes.tier_intersection(params);
    expect(result).toBe(1); // 10 is in first tier because max is inclusive when min is not

    params.input = 15;
    result = wtes.tier_intersection(params);
    expect(result).toBe(2);

    params.input = 25;
    result = wtes.tier_intersection(params);
    expect(result).toBe(3);

    params.input = 30;
    result = wtes.tier_intersection(params);
    expect(result).toBe(3); // 30 is in last tier because max is inclusive when min is not

    params.input = 35;
    result = wtes.tier_intersection(params);
    expect(result).toBe(0); // no tier matched
  });

  it('should determine tier_intersection_multiply correctly', () => {
    const tiers = [
      { min: 0, max: 10, value: 1 },
      { min: 10, max: 20, value: 2 },
      { min: 20, max: 30, value: 3 },
    ];

    let params = {
      input: 5,
      tiers,
      return_value_proration: 1,
      min_max_proration: 1,
      min_inclusive: false,
    };
    let result = wtes.tier_intersection_multiply(params);
    expect(result).toBe(5); // tier 1 * input 5

    params.input = 10;
    result = wtes.tier_intersection_multiply(params);
    expect(result).toBe(10); // tier 1 * input 10

    params.input = 15;
    result = wtes.tier_intersection_multiply(params);
    expect(result).toBe(30); // tier 2 * input 15

    params.input = 25;
    result = wtes.tier_intersection_multiply(params);
    expect(result).toBe(75); // tier 3 * input 25

    params.input = 30;
    result = wtes.tier_intersection_multiply(params);
    expect(result).toBe(90); // tier 3 * input 30

    params.input = 35;
    result = wtes.tier_intersection_multiply(params);
    expect(result).toBe(0); // no tier matched
  });

  it('should determine tier_overlap_multiply correctly', () => {
    const tiers = [
      { min: 0, max: 100, value: 5 },
      { min: 100, max: 200, value: 6 },
      { min: 200, max: 0, value: 7 },
    ];

    let params = {
      input: 250,
      tiers,
      return_value_proration: 1,
      min_max_proration: 1,
    };
    let result = wtes.tier_overlap_multiply(params);
    // 100 * 5 + 100 * 6 + 50 * 7
    // = 500 + 600 + 350
    // = 1450
    expect(result).toBe(1450);

    params.input = 150;
    result = wtes.tier_overlap_multiply(params);
    // 100 * 5 + 50 * 6
    // = 500 + 300
    // = 800
    expect(result).toBe(800);

    params.input = 50;
    result = wtes.tier_overlap_multiply(params);
    // 50 * 5 = 250
    expect(result).toBe(250);

    params.input = 350;
    result = wtes.tier_overlap_multiply(params);
    // 100 * 5 + 100 * 6 + 150 * 7
    // = 500 + 600 + 1050
    // = 2150
    expect(result).toBe(2150);
  });

  it('should calculate events_math correctly', () => {
    let result = wtes.events_math('SUM', 'PatientSatisfaction');
    expect(result).toBe(15.6);

    result = wtes.events_math('MAX', 'PatientSatisfaction');
    expect(result).toBe(4.5);

    result = wtes.events_math('COUNT', 'PatientSatisfaction');
    expect(result).toBe(4);

    result = wtes.events_math('SUM', 'wRVU');
    expect(result).toBe(5.7);

    result = wtes.events_math('MAX', 'wRVU');
    expect(result).toBe(3.2);

    result = wtes.events_math('COUNT', 'wRVU');
    expect(result).toBe(2);

    // events that don't exist
    result = wtes.events_math('SUM', 'NonExistentEvent');
    expect(result).toBe(null);

    result = wtes.events_math('MAX', 'NonExistentEvent');
    expect(result).toBe(null);

    result = wtes.events_math('COUNT', 'NonExistentEvent');
    expect(result).toBe(0);
  });

  it('should calculate most_recent_events correctly', () => {
    const resultMostRecent = wtes.most_recent_events('MOST RECENT', 'PatientSatisfaction');
    expect(resultMostRecent).toBe(3.1);

    const resultOldest = wtes.most_recent_events('OLDEST', 'PatientSatisfaction');
    expect(resultOldest).toBe(4.2);
  });
});

import { describe, it, expect } from 'vitest';
import wtes from './wtes.js';

describe('wte tests', () => {
  const mathTests = [
    { operation: 'COUNT', list: [1, 2, 3], expected: 3 },
    { operation: 'MAX', list: [1, 2, 3], expected: 3 },
    { operation: 'MIN', list: [1, 2, 3], expected: 1 },
    { operation: 'AVERAGE', list: [1, 2, 3], expected: 2 },
    { operation: 'SUM', list: [1, 2, 3], expected: 6 },
    { operation: 'MULTIPLY', list: [1, 2, 3], expected: 6 },
    { operation: 'SUM', list: [], expected: null }, // edge case
    { operation: 'MULTIPLY', list: [], expected: null }, // edge case
    { operation: 'UNKNOWN', list: [1, 2, 3], expected: null }, // edge case
  ];

  mathTests.forEach(({ operation, list, expected }) => {
    it(`math ${operation} of [${list}] should be ${expected}`, () => {
      const result = wtes.math(operation, list);
      expect(result).toBe(expected);
    });
  });

  it('should define and call a wte correctly, same context uses cache', () => {
    wtes.reset();

    const wteName = 'test_wte';
    const outputCallback = (context) => wtes.multiply(context.value, 2);
    wtes.define(wteName, outputCallback);

    const contextOverrides = { value: 5 };
    const result = wtes.call(wteName, contextOverrides);
    expect(result).toBe(10);

    // test caching
    expect(wtes.logs.length).toBe(3); // define + call + multiply

    // subsequent calls with diff context should get diff result
    const contextOverrides2 = { value: 10 };
    const result2 = wtes.call(wteName, contextOverrides2);
    expect(result2).toBe(20);

    expect(wtes.logs.length).toBe(5); // + 2 more logs for call and multiply

    // calling again with first context should return cached result without adding new logs
    const result3 = wtes.call(wteName, contextOverrides);
    expect(result3).toBe(10);
    expect(wtes.logs.length).toBe(6); // + only 1 more log for call, multiply not called again because result was cached
  });

  it('should return error when calling undefined wte', () => {
    const result = wtes.call('undefined_wte', {});
    expect(result).toBe('error: wte not defined');
  });

  it('should sum numbers correctly', () => {
    const result = wtes.sum(1, 2, 3, 4);
    expect(result).toBe(10);
  });

  it('should subtract numbers correctly', () => {
    const result = wtes.subtract(10, 2, 3);
    expect(result).toBe(5);
  });

  it('should return conditional number correctly', () => {
    const resultTrue = wtes.conditional_number(1, 'equals', 1, 1, 0);
    expect(resultTrue).toBe(1);

    const resultFalse = wtes.conditional_number(2, 'equals', 1, 1, 0);
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
    expect(wtes.divide(10, 2)).toBe(5);
    expect(wtes.divide(10, 2, 2)).toBe(2.5);
    expect(wtes.divide(10, 0)).toBe(Infinity);
    expect(wtes.divide(10, 4, 0)).toBe(Infinity);
    expect(wtes.divide(0, 4)).toBe(0);
    expect(wtes.divide(0, 4, 4)).toBe(0);
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

  it('should determine tier_intersection multiply_by_input correctly', () => {
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
      multiply_by_input: true,
    };
    let result = wtes.tier_intersection(params);
    expect(result).toBe(5); // tier 1 * input 5

    params.input = 10;
    result = wtes.tier_intersection(params);
    expect(result).toBe(10); // tier 1 * input 10

    params.input = 15;
    result = wtes.tier_intersection(params);
    expect(result).toBe(30); // tier 2 * input 15

    params.input = 25;
    result = wtes.tier_intersection(params);
    expect(result).toBe(75); // tier 3 * input 25

    params.input = 30;
    result = wtes.tier_intersection(params);
    expect(result).toBe(90); // tier 3 * input 30

    params.input = 35;
    result = wtes.tier_intersection(params);
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

  it('should calculate events_value correctly', () => {
    let result = wtes.events_value('SUM', 'PatientSatisfaction');
    expect(result).toBe(15.6);

    result = wtes.events_value('MAX', 'PatientSatisfaction');
    expect(result).toBe(4.5);

    result = wtes.events_value('COUNT', 'PatientSatisfaction');
    expect(result).toBe(4);

    result = wtes.events_value('SUM', 'wRVU');
    expect(result).toBe(5.7);

    result = wtes.events_value('MAX', 'wRVU');
    expect(result).toBe(3.2);

    result = wtes.events_value('COUNT', 'wRVU');
    expect(result).toBe(2);

    // events that don't exist
    result = wtes.events_value('SUM', 'NonExistentEvent');
    expect(result).toBe(null);

    result = wtes.events_value('MAX', 'NonExistentEvent');
    expect(result).toBe(null);

    result = wtes.events_value('COUNT', 'NonExistentEvent');
    expect(result).toBe(0);

    // most recent / oldest
    result = wtes.events_value('MOST RECENT', 'PatientSatisfaction');
    expect(result).toBe(3.1);

    result = wtes.events_value('OLDEST', 'PatientSatisfaction');
    expect(result).toBe(4.2);
  });

  it('should apply events_value filters correctly', () => {
    const filter1 = { key: 'participant_id', value: 'doctor_001', condition: 'equals' }
    const filter2 = { key: 'characterization', value: 'Good', condition: 'equals' }
    let result = wtes.events_value('sum', 'PatientSatisfaction', [filter1, filter2]);
    expect(result).toBe(3.8);

    result = wtes.events_value('sum', 'PatientSatisfaction', [filter1]);
    expect(result).toBe(12.5);
  });

  it('should get correct # of frames from recurrence_frame', () => {
    // recurrence - daily for 10 days
    const recurrence = {
      window_start: new Date('2023-01-01'),
      window_end: new Date('2023-01-10'),
      frequency: 'day',
      interval: 1,
      anchor: new Date('2023-01-01'),
    };

    // sample offset - not used yet
    const offset = {};

    // sample context
    const context = {
      val1: 10,
      val2: 20,
    };

    // output func - sum of val1 and val2 from context
    const outputFunc = (ctx) =>
      wtes.sum(
        wtes.context_variable(ctx, 'val1'),
        wtes.context_variable(ctx, 'val2'),
        wtes.context_variable(ctx, 'frame_index')
      );

    // run the frame, should get 10 results, all with value 30 + their index
    const result = wtes.recurrence_frame(context, recurrence, offset, outputFunc);
    expect(result.length).toBe(10);
    result.forEach((val, i) => expect(val).toBe(30 + i));
  });

  it('should return empty array for recurrence_frame with endDate before startDate', () => {
    const recurrence = {
      window_start: new Date('2023-01-10'),
      window_end: new Date('2023-01-01'), // end before start
      frequency: 'day',
      interval: 1,
      anchor: new Date('2023-01-01'),
    };

    const context = {};
    const outputFunc = (ctx) => 1;
    const result = wtes.recurrence_frame(context, recurrence, {}, outputFunc);
    expect(result).toEqual([]); // should be empty array
  });

  it('recurrent_frame frequencies all work correctly', () => {
    const frequencies = ['day', 'week', 'half_month', 'month'];
    const expectedCounts = [10, 2, 1, 1]; // for the given date range

    frequencies.forEach((freq, idx) => {
      const recurrence = {
        window_start: new Date('2023-01-01'),
        window_end: new Date('2023-01-10'),
        frequency: freq,
        interval: 1,
        anchor: new Date('2023-01-01'),
      };
      const context = {};
      const outputFunc = (ctx) => 1;
      const result = wtes.recurrence_frame(context, recurrence, {}, outputFunc);
      expect(result.length).toBe(expectedCounts[idx]);
    });
  });
});

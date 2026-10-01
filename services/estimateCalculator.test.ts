/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { calculateBOM } from './estimateCalculator';
import { YardSegment, GateConfig } from '../types';

describe('estimateCalculator - calculateBOM', () => {
  it('correctly calculates basic backyard fence and bill of materials', () => {
    const segments: YardSegment[] = [
      { id: 'seg-1', name: 'Left Side', lengthFeet: 50, singleGates: 1, doubleGates: 0, hasTearOut: false },
      { id: 'seg-2', name: 'Back Side', lengthFeet: 50, singleGates: 0, doubleGates: 0, hasTearOut: false },
    ];

    const gates: GateConfig = {
      singleGatesCount: 1,
      singleGateWidthFt: 4,
      doubleGatesCount: 0,
      doubleGateWidthFt: 0,
      automatedSolarOperator: false,
      keypadAccess: false,
      antiSagKits: false,
    };

    const result = calculateBOM({
      segments,
      tearOutFeet: 0,
      postSpacingFeet: 8,
      railCount: 3,
      heightFeet: 6,
      postType: 'cedar_4x4',
      material: 'cedar_privacy',
      hasRotBoard: false,
      hasCapAndTrim: false,
      hasStaining: false,
      terrain: 'flat',
      gates,
    });

    expect(result.totalLinearFeet).toBe(100);
    expect(result.singleGateKits).toBe(1);
    expect(result.doubleGateKits).toBe(0);
    expect(result.materialsCost).toBeGreaterThan(0);
    expect(result.laborCost).toBeGreaterThan(0);
    expect(result.totalCost).toBe(result.subtotal + result.tax);
  });

  it('correctly includes postmaster steel adder and slope modifiers', () => {
    const segments: YardSegment[] = [
      { id: 'seg-1', name: 'Left Side', lengthFeet: 50, singleGates: 1, doubleGates: 0, hasTearOut: false },
    ];

    const gates: GateConfig = {
      singleGatesCount: 1,
      singleGateWidthFt: 4,
      doubleGatesCount: 0,
      doubleGateWidthFt: 0,
      automatedSolarOperator: false,
      keypadAccess: false,
      antiSagKits: false,
    };

    const flatResult = calculateBOM({
      segments,
      tearOutFeet: 0,
      postSpacingFeet: 8,
      railCount: 3,
      heightFeet: 6,
      postType: 'cedar_4x4',
      material: 'cedar_privacy',
      hasRotBoard: false,
      hasCapAndTrim: false,
      hasStaining: false,
      terrain: 'flat',
      gates,
    });

    const steepPostmasterResult = calculateBOM({
      segments,
      tearOutFeet: 0,
      postSpacingFeet: 8,
      railCount: 3,
      heightFeet: 6,
      postType: 'postmaster_steel',
      material: 'cedar_privacy',
      hasRotBoard: false,
      hasCapAndTrim: false,
      hasStaining: false,
      terrain: 'steep_slope',
      gates,
    });

    expect(steepPostmasterResult.materialsCost).toBeGreaterThan(flatResult.materialsCost);
    expect(steepPostmasterResult.laborCost).toBeGreaterThan(flatResult.laborCost);
  });

  it('calculates a valid projected timeline', () => {
    const segments: YardSegment[] = [
      { id: 'seg-1', name: 'Back Yard', lengthFeet: 150, singleGates: 2, doubleGates: 0, hasTearOut: true },
    ];

    const gates: GateConfig = {
      singleGatesCount: 2,
      singleGateWidthFt: 4,
      doubleGatesCount: 0,
      doubleGateWidthFt: 0,
      automatedSolarOperator: false,
      keypadAccess: false,
      antiSagKits: false,
    };

    const result = calculateBOM({
      segments,
      tearOutFeet: 150,
      postSpacingFeet: 7.5,
      railCount: 3,
      heightFeet: 6,
      postType: 'postmaster_steel',
      material: 'cedar_privacy',
      hasRotBoard: true,
      hasCapAndTrim: true,
      hasStaining: true,
      terrain: 'flat',
      gates,
    });

    expect(result.timeline).toBeDefined();
    expect(result.timeline.totalWorkDays).toBeGreaterThan(3); // Demo + Posts + Build + Stain should be > 3 days for 150ft
    expect(result.timeline.phases.length).toBeGreaterThan(0);
    expect(new Date(result.timeline.estimatedStartDate).getTime()).toBeGreaterThan(Date.now());
    expect(new Date(result.timeline.estimatedCompletionDate).getTime()).toBeGreaterThan(new Date(result.timeline.estimatedStartDate).getTime());
  });

  it('respects dynamic queue lead time days', () => {
    const segments: YardSegment[] = [{ id: 's1', name: 'Line', lengthFeet: 50, singleGates: 0, doubleGates: 0, hasTearOut: false }];
    const gates: GateConfig = { singleGatesCount: 0, singleGateWidthFt: 0, doubleGatesCount: 0, doubleGateWidthFt: 0, automatedSolarOperator: false, keypadAccess: false, antiSagKits: false };
    
    const leadTime = 30;
    const result = calculateBOM({
      segments,
      tearOutFeet: 0,
      postSpacingFeet: 8,
      railCount: 3,
      heightFeet: 6,
      postType: 'cedar_4x4',
      material: 'cedar_privacy',
      hasRotBoard: false,
      hasCapAndTrim: false,
      hasStaining: false,
      terrain: 'flat',
      gates,
      queueLeadTimeDays: leadTime
    });

    const start = new Date(result.timeline.estimatedStartDate);
    const today = new Date();
    const diffDays = Math.round((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    expect(diffDays).toBe(leadTime);
  });
});

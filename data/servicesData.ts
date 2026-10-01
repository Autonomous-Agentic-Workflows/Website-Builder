/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ServiceItem } from '../types';

export const AI_STUDIO_APP_URL = 'https://ai.studio/apps/a6911d27-7fd4-4c47-af8f-bd02979f37c8';
export const AI_STUDIO_APP_ID = 'a6911d27-7fd4-4c47-af8f-bd02979f37c8';

export const SERVICES_DATA: ServiceItem[] = [
  { 
    id: '1', 
    name: 'Western Red Cedar Privacy', 
    genre: 'Residential Contracting', 
    day: 'CONTRACTOR', 
    division: 'contractor',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    description: 'Precision-crafted Pacific Northwest Western Red Cedar privacy fencing. Engineered with steel-reinforced post systems, rot-board base protection, and weather-resistant structural framing built to withstand Idaho wind and snow loads.',
    features: [
      'Grade #1 Clear Western Red Cedar Pickets',
      'Heavy-duty PostMaster steel hidden posts',
      'Pressure-treated 2x4 framing with ring-shank nails',
      '10-Year Craftsmanship Warranty'
    ],
    pricingEstimate: 'From $34 / linear foot installed',
    metrics: [
      { label: 'Wind Rating', value: '85+ MPH' },
      { label: 'Lifespan', value: '25+ Yrs' }
    ]
  },
  { 
    id: '2', 
    name: 'Smart Automated Driveway Gates', 
    genre: 'Contractor + Smart Automation', 
    day: 'HYBRID', 
    division: 'hybrid',
    image: 'https://images.unsplash.com/photo-1584463699026-646700c25a07?q=80&w=1200&auto=format&fit=crop',
    description: 'Custom fabricated architectural driveway gates powered by solar or hardwired DC motors, optical obstruction detection, and smartphone-controlled perimeter telemetry for seamless estate entry.',
    features: [
      'Heavy-wall steel and aluminum custom fabrication',
      'LiftMaster & Ghost Controls commercial grade actuators',
      'Solar array charging with battery backup',
      'Smartphone app, keypads, and RFID vehicle tags'
    ],
    pricingEstimate: 'Custom systems from $3,450',
    metrics: [
      { label: 'Cycle Rating', value: '100k+ Cycles' },
      { label: 'Power Options', value: '12V Solar / 110V' }
    ]
  },
  { 
    id: '3', 
    name: 'Architectural Ornamental Iron', 
    genre: 'Residential Contracting', 
    day: 'CONTRACTOR', 
    division: 'contractor',
    image: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=1200&auto=format&fit=crop',
    description: 'Timeless welded steel and aluminum estate fencing featuring multi-stage electro-coat powder protection. Delivers maximum curb appeal, perimeter security, and swimming pool safety compliance.',
    features: [
      'Multi-stage electrostatic powder coating',
      'Self-closing magnetic MagnaLatch child-safe hinges',
      'Custom spear, flat-top, and puppy-picket options',
      'Zero-corrosion manufacturer guarantee'
    ],
    pricingEstimate: 'From $42 / linear foot installed',
    metrics: [
      { label: 'Coating', value: 'Industrial E-Coat' },
      { label: 'Pool Code', value: '100% Compliant' }
    ]
  },
  { 
    id: '4', 
    name: 'Maintenance-Free Vinyl & Composite', 
    genre: 'Residential Contracting', 
    day: 'CONTRACTOR', 
    division: 'contractor',
    image: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=1200&auto=format&fit=crop',
    description: 'High-impact virgin vinyl and composite perimeters engineered with internal aluminum reinforcement. Impervious to moisture, rot, fading, and peeling without requiring staining.',
    features: [
      'UV-stabilized virgin vinyl formulation',
      'Aluminum bottom-rail anti-sag channel',
      'Full privacy, lattice accent, and semi-privacy styles',
      'Lifetime non-fade manufacturer warranty'
    ],
    pricingEstimate: 'From $38 / linear foot installed',
    metrics: [
      { label: 'Maintenance', value: 'Zero Paint/Stain' },
      { label: 'UV Resistance', value: 'Class 1 Rating' }
    ]
  },
  { 
    id: '5', 
    name: 'FenceQuote OS & Estimating Platform', 
    genre: 'Software Development Lab', 
    day: 'DEVELOPER', 
    division: 'developer',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
    description: 'Next-generation cloud estimating engine and GIS property parcel mapper built specifically for fence contractors. Automatically calculates linear footage, bill-of-materials, concrete yardage, and client proposals in seconds.',
    features: [
      'Satellite aerial GIS parcel boundary tracing',
      'Live dynamic supplier material cost calculations',
      'Instant interactive quote generation with e-signatures',
      'REST APIs & QuickBooks / CRM webhook sync'
    ],
    pricingEstimate: 'SaaS licensing from $199/mo',
    metrics: [
      { label: 'Estimate Speed', value: '< 2 Minutes' },
      { label: 'BOM Accuracy', value: '99.8%' }
    ]
  },
  { 
    id: '6', 
    name: 'SmartGate IoT Access & Controller API', 
    genre: 'Software Development Lab', 
    day: 'DEVELOPER', 
    division: 'developer',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    description: 'Microcontroller hardware firmware, LoRaWAN / cellular telemetry units, and secure cloud API for automated gate diagnostics, visitor guest passes, and automated license plate entry.',
    features: [
      'End-to-end encrypted MQTT & WebSockets telemetry',
      'Automatic license plate reader (ALPR) camera integration',
      'HomeKit, Google Home & custom Alexa integration skill',
      'Live gate status, battery voltage & fault alerts'
    ],
    pricingEstimate: 'Hardware + Cloud API Integration',
    metrics: [
      { label: 'Latency', value: '< 180ms' },
      { label: 'Encryption', value: 'AES-256' }
    ]
  },
];

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { FtrProviderContext } from '../../../ftr_provider_context';
import { ML_JOB_FIELD_TYPES } from '../../../../../plugins/ml/common/constants/field_types';
import { FieldVisConfig } from '../../../../../plugins/ml/public/application/datavisualizer/index_based/common';

interface MetricFieldVisConfig extends FieldVisConfig {
  statsMaxDecimalPlaces: number;
  docCountFormatted: string;
  selectedDetailsMode: 'distribution' | 'top_values';
  topValuesCount: number;
}

interface NonMetricFieldVisConfig extends FieldVisConfig {
  exampleCount?: number;
}

interface TestData {
  suiteTitle: string;
  sourceIndexOrSavedSearch: string;
  metricFieldsFilter: string;
  nonMetricFieldsFilter: string;
  nonMetricFieldsTypeFilter: string;
  expected: {
    totalDocCountFormatted: string;
    fieldsPanelCount: number;
    documentCountCard: FieldVisConfig;
    metricCards?: MetricFieldVisConfig[];
    nonMetricCards?: NonMetricFieldVisConfig[];
    nonMetricFieldsTypeFilterCardCount: number;
    metricFieldsFilterCardCount: number;
    nonMetricFieldsFilterCardCount: number;
  };
}

function getFieldTypes(cards: FieldVisConfig[]) {
  const fieldTypes: ML_JOB_FIELD_TYPES[] = [];
  cards.forEach((card) => {
    const fieldType = card.type;
    if (fieldTypes.includes(fieldType) === false) {
      fieldTypes.push(fieldType);
    }
  });

  return fieldTypes.sort();
}

export default function ({ getService }: FtrProviderContext) {
  const esArchiver = getService('esArchiver');
  const ml = getService('ml');

  const farequoteIndexPatternTestData: TestData = {
    suiteTitle: 'index pattern',
    sourceIndexOrSavedSearch: 'ft_farequote',
    metricFieldsFilter: 'document',
    nonMetricFieldsFilter: 'airline',
    nonMetricFieldsTypeFilter: 'keyword',
    expected: {
      totalDocCountFormatted: '86,274',
      fieldsPanelCount: 2, // Metrics panel and Fields panel
      documentCountCard: {
        type: ML_JOB_FIELD_TYPES.NUMBER,
        existsInDocs: true,
        aggregatable: true,
        loading: false,
      },
      metricCards: [
        {
          fieldName: 'responsetime',
          type: ML_JOB_FIELD_TYPES.NUMBER,
          existsInDocs: true,
          aggregatable: true,
          loading: false,
          docCountFormatted: '5,000',
          statsMaxDecimalPlaces: 3,
          selectedDetailsMode: 'distribution',
          topValuesCount: 10,
        },
      ],
      nonMetricCards: [
        {
          fieldName: '@timestamp',
          type: ML_JOB_FIELD_TYPES.DATE,
          existsInDocs: true,
          aggregatable: true,
          loading: false,
        },
        {
          fieldName: '@version',
          type: ML_JOB_FIELD_TYPES.TEXT,
          existsInDocs: true,
          aggregatable: false,
          loading: false,
          exampleCount: 1,
        },
        {
          fieldName: '@version.keyword',
          type: ML_JOB_FIELD_TYPES.KEYWORD,
          existsInDocs: true,
          aggregatable: true,
          loading: false,
          exampleCount: 1,
        },
        {
          fieldName: 'airline',
          type: ML_JOB_FIELD_TYPES.KEYWORD,
          existsInDocs: true,
          aggregatable: true,
          loading: false,
          exampleCount: 10,
        },
        {
          fieldName: 'type',
          type: ML_JOB_FIELD_TYPES.TEXT,
          existsInDocs: true,
          aggregatable: false,
          loading: false,
          exampleCount: 1,
        },
        {
          fieldName: 'type.keyword',
          type: ML_JOB_FIELD_TYPES.KEYWORD,
          existsInDocs: true,
          aggregatable: true,
          loading: false,
          exampleCount: 1,
        },
      ],
      nonMetricFieldsTypeFilterCardCount: 3,
      metricFieldsFilterCardCount: 1,
      nonMetricFieldsFilterCardCount: 1,
    },
  };

  const farequoteKQLSearchTestData: TestData = {
    suiteTitle: 'KQL saved search',
    sourceIndexOrSavedSearch: 'ft_farequote_kuery',
    metricFieldsFilter: 'responsetime',
    nonMetricFieldsFilter: 'airline',
    nonMetricFieldsTypeFilter: 'keyword',
    expected: {
      totalDocCountFormatted: '34,415',
      fieldsPanelCount: 2, // Metrics panel and Fields panel
      documentCountCard: {
        type: ML_JOB_FIELD_TYPES.NUMBER,
        existsInDocs: true,
        aggregatable: true,
        loading: false,
      },
      metricCards: [
        {
          fieldName: 'responsetime',
          type: ML_JOB_FIELD_TYPES.NUMBER,
          existsInDocs: true,
          aggregatable: true,
          loading: false,
          docCountFormatted: '5,000',
          statsMaxDecimalPlaces: 3,
          selectedDetailsMode: 'distribution',
          topValuesCount: 10,
        },
      ],
      nonMetricCards: [
        {
          fieldName: '@timestamp',
          type: ML_JOB_FIELD_TYPES.DATE,
          existsInDocs: true,
          aggregatable: true,
          loading: false,
        },
        {
          fieldName: '@version',
          type: ML_JOB_FIELD_TYPES.TEXT,
          existsInDocs: true,
          aggregatable: false,
          loading: false,
          exampleCount: 1,
        },
        {
          fieldName: '@version.keyword',
          type: ML_JOB_FIELD_TYPES.KEYWORD,
          existsInDocs: true,
          aggregatable: true,
          loading: false,
          exampleCount: 1,
        },
        {
          fieldName: 'airline',
          type: ML_JOB_FIELD_TYPES.KEYWORD,
          existsInDocs: true,
          aggregatable: true,
          loading: false,
          exampleCount: 5,
        },
        {
          fieldName: 'type',
          type: ML_JOB_FIELD_TYPES.TEXT,
          existsInDocs: true,
          aggregatable: false,
          loading: false,
          exampleCount: 1,
        },
        {
          fieldName: 'type.keyword',
          type: ML_JOB_FIELD_TYPES.KEYWORD,
          existsInDocs: true,
          aggregatable: true,
          loading: false,
          exampleCount: 1,
        },
      ],
      nonMetricFieldsTypeFilterCardCount: 3,
      metricFieldsFilterCardCount: 2,
      nonMetricFieldsFilterCardCount: 1,
    },
  };

  const farequoteLuceneSearchTestData: TestData = {
    suiteTitle: 'lucene saved search',
    sourceIndexOrSavedSearch: 'ft_farequote_lucene',
    metricFieldsFilter: 'responsetime',
    nonMetricFieldsFilter: 'version',
    nonMetricFieldsTypeFilter: 'keyword',
    expected: {
      totalDocCountFormatted: '34,416',
      fieldsPanelCount: 2, // Metrics panel and Fields panel
      documentCountCard: {
        type: ML_JOB_FIELD_TYPES.NUMBER, // document count card
        existsInDocs: true,
        aggregatable: true,
        loading: false,
      },
      metricCards: [
        {
          fieldName: 'responsetime',
          type: ML_JOB_FIELD_TYPES.NUMBER,
          existsInDocs: true,
          aggregatable: true,
          loading: false,
          docCountFormatted: '5,000',
          statsMaxDecimalPlaces: 3,
          selectedDetailsMode: 'distribution',
          topValuesCount: 10,
        },
      ],
      nonMetricCards: [
        {
          fieldName: '@timestamp',
          type: ML_JOB_FIELD_TYPES.DATE,
          existsInDocs: true,
          aggregatable: true,
          loading: false,
        },
        {
          fieldName: '@version',
          type: ML_JOB_FIELD_TYPES.TEXT,
          existsInDocs: true,
          aggregatable: false,
          loading: false,
          exampleCount: 1,
        },
        {
          fieldName: '@version.keyword',
          type: ML_JOB_FIELD_TYPES.KEYWORD,
          existsInDocs: true,
          aggregatable: true,
          loading: false,
          exampleCount: 1,
        },
        {
          fieldName: 'airline',
          type: ML_JOB_FIELD_TYPES.KEYWORD,
          existsInDocs: true,
          aggregatable: true,
          loading: false,
          exampleCount: 5,
        },
        {
          fieldName: 'type',
          type: ML_JOB_FIELD_TYPES.TEXT,
          existsInDocs: true,
          aggregatable: false,
          loading: false,
          exampleCount: 1,
        },
        {
          fieldName: 'type.keyword',
          type: ML_JOB_FIELD_TYPES.KEYWORD,
          existsInDocs: true,
          aggregatable: true,
          loading: false,
          exampleCount: 1,
        },
      ],
      nonMetricFieldsTypeFilterCardCount: 3,
      metricFieldsFilterCardCount: 2,
      nonMetricFieldsFilterCardCount: 1,
    },
  };

  function runTests(testData: TestData) {
    it(`${testData.suiteTitle} loads the source data in the data visualizer`, async () => {
      await ml.testExecution.logTestStep(
        `${testData.suiteTitle} loads the saved search selection page`
      );
      await ml.dataVisualizer.navigateToIndexPatternSelection();

      await ml.testExecution.logTestStep(
        `${testData.suiteTitle} loads the index data visualizer page`
      );
      await ml.jobSourceSelection.selectSourceForIndexBasedDataVisualizer(
        testData.sourceIndexOrSavedSearch
      );
    });

    it(`${testData.suiteTitle} displays index details`, async () => {
      await ml.testExecution.logTestStep(`${testData.suiteTitle} displays the time range step`);
      await ml.dataVisualizerIndexBased.assertTimeRangeSelectorSectionExists();

      await ml.testExecution.logTestStep(`${testData.suiteTitle} loads data for full time range`);
      await ml.dataVisualizerIndexBased.clickUseFullDataButton(
        testData.expected.totalDocCountFormatted
      );

      await ml.testExecution.logTestStep(`${testData.suiteTitle} displays the panels of fields`);
      await ml.dataVisualizerIndexBased.assertFieldsPanelsExist(testData.expected.fieldsPanelCount);

      await ml.testExecution.logTestStep(`${testData.suiteTitle} displays the Metrics panel`);
      await ml.dataVisualizerIndexBased.assertFieldsPanelForTypesExist([ML_JOB_FIELD_TYPES.NUMBER]);

      await ml.testExecution.logTestStep(
        `${testData.suiteTitle} displays the expected document count card`
      );
      await ml.dataVisualizerIndexBased.assertCardExists(
        testData.expected.documentCountCard.type,
        testData.expected.documentCountCard.fieldName
      );
      await ml.dataVisualizerIndexBased.assertDocumentCountCardContents();

      await ml.testExecution.logTestStep(
        `${testData.suiteTitle} displays the expected metric field cards and contents`
      );

      if (testData.expected.metricCards !== undefined && testData.expected.metricCards.length > 0) {
        await ml.testExecution.logTestStep(
          `${testData.suiteTitle} displays the expected metric field cards and contents`
        );
        for (const fieldCard of testData.expected.metricCards as MetricFieldVisConfig[]) {
          await ml.dataVisualizerIndexBased.assertCardExists(fieldCard.type, fieldCard.fieldName);
          await ml.dataVisualizerIndexBased.assertNumberCardContents(
            fieldCard.fieldName!,
            fieldCard.docCountFormatted,
            fieldCard.statsMaxDecimalPlaces,
            fieldCard.selectedDetailsMode,
            fieldCard.topValuesCount
          );
        }

        await ml.testExecution.logTestStep(
          `${testData.suiteTitle} filters metric fields cards with search`
        );
        await ml.dataVisualizerIndexBased.filterFieldsPanelWithSearchString(
          ['number'],
          testData.metricFieldsFilter,
          testData.expected.metricFieldsFilterCardCount
        );
      }

      if (
        testData.expected.nonMetricCards !== undefined &&
        testData.expected.nonMetricCards.length > 0
      ) {
        await ml.testExecution.logTestStep(
          `${testData.suiteTitle} displays the non-metric Fields panel`
        );
        await ml.dataVisualizerIndexBased.assertFieldsPanelForTypesExist(
          getFieldTypes(testData.expected.nonMetricCards as FieldVisConfig[])
        );

        await ml.testExecution.logTestStep(
          `${testData.suiteTitle} displays the expected non-metric field cards and contents`
        );
        for (const fieldCard of testData.expected.nonMetricCards!) {
          await ml.dataVisualizerIndexBased.assertCardExists(fieldCard.type, fieldCard.fieldName);
          await ml.dataVisualizerIndexBased.assertNonMetricCardContents(
            fieldCard.type,
            fieldCard.fieldName!,
            fieldCard.exampleCount
          );
        }

        await ml.testExecution.logTestStep(
          `${testData.suiteTitle} sets the non metric field types input`
        );
        const fieldTypes: ML_JOB_FIELD_TYPES[] = getFieldTypes(
          testData.expected.nonMetricCards as FieldVisConfig[]
        );
        await ml.dataVisualizerIndexBased.assertFieldsPanelTypeInputExists(fieldTypes);
        await ml.dataVisualizerIndexBased.setFieldsPanelTypeInputValue(
          fieldTypes,
          testData.nonMetricFieldsTypeFilter,
          testData.expected.nonMetricFieldsTypeFilterCardCount
        );

        await ml.testExecution.logTestStep(
          `${testData.suiteTitle} filters non-metric fields cards with search`
        );
        await ml.dataVisualizerIndexBased.filterFieldsPanelWithSearchString(
          fieldTypes,
          testData.nonMetricFieldsFilter,
          testData.expected.nonMetricFieldsFilterCardCount
        );

        await ml.testExecution.logTestStep(
          `${testData.suiteTitle} sample size control changes non-metric field cards doc count`
        );
        await ml.dataVisualizerIndexBased.clearFieldsPanelSearchInput(fieldTypes);
        await ml.dataVisualizerIndexBased.assertSampleSizeInputExists();
        await ml.dataVisualizerIndexBased.setSampleSizeInputValue(
          1000,
          ML_JOB_FIELD_TYPES.KEYWORD,
          'airline',
          '1,000'
        );
      }
    });
  }

  describe('index based', function () {
    this.tags(['mlqa']);
    before(async () => {
      await esArchiver.loadIfNeeded('ml/farequote');
      await ml.testResources.createIndexPatternIfNeeded('ft_farequote', '@timestamp');
      await ml.testResources.createSavedSearchFarequoteLuceneIfNeeded();
      await ml.testResources.createSavedSearchFarequoteKueryIfNeeded();
      await ml.testResources.setKibanaTimeZoneToUTC();

      await ml.securityUI.loginAsMlPowerUser();
    });

    describe('with farequote', function () {
      // Run tests on full farequote index.
      it(`${farequoteIndexPatternTestData.suiteTitle} loads the data visualizer selector page`, async () => {
        // Start navigation from the base of the ML app.
        await ml.navigation.navigateToMl();
        await ml.navigation.navigateToDataVisualizer();
      });

      runTests(farequoteIndexPatternTestData);

      // Run tests on farequote KQL saved search.
      it(`${farequoteKQLSearchTestData.suiteTitle} loads the data visualizer selector page`, async () => {
        // Only navigate back to the data visualizer selector page before running next tests,
        // to ensure the time picker isn't set back to the default (last 15 minutes).
        await ml.navigation.navigateToDataVisualizer();
      });

      runTests(farequoteKQLSearchTestData);

      // Run tests on farequote lucene saved search.
      it(`${farequoteLuceneSearchTestData.suiteTitle} loads the data visualizer selector page`, async () => {
        // Only navigate back to the data visualizer selector page before running next tests,
        // to ensure the time picker isn't set back to the default (last 15 minutes).
        await ml.navigation.navigateToDataVisualizer();
      });

      runTests(farequoteLuceneSearchTestData);
    });
  });
}

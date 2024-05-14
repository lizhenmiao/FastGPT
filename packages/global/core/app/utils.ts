import type { AppSimpleEditFormType } from '../app/type';
import { FlowNodeTypeEnum } from '../workflow/node/constant';
import { NodeInputKeyEnum, FlowNodeTemplateTypeEnum } from '../workflow/constants';
import type { FlowNodeInputItemType } from '../workflow/type/io.d';
import { getGuideModule, splitGuideModule } from '../workflow/utils';
import { StoreNodeItemType } from '../workflow/type';
import { DatasetSearchModeEnum } from '../dataset/constants';
import { defaultWhisperConfig } from './constants';

export const getDefaultAppForm = (): AppSimpleEditFormType => {
  return {
    aiSettings: {
      model: 'gpt-3.5-turbo',
      systemPrompt: '',
      temperature: 0,
      isResponseAnswerText: true,
      maxHistories: 6,
      maxToken: 4000
    },
    dataset: {
      datasets: [],
      similarity: 0.4,
      limit: 1500,
      searchMode: DatasetSearchModeEnum.embedding,
      usingReRank: false,
      datasetSearchUsingExtensionQuery: true,
      datasetSearchExtensionBg: ''
    },
    selectedTools: [],
    userGuide: {
      welcomeText: '',
      variables: [],
      questionGuide: false,
      tts: {
        type: 'web'
      },
      whisper: defaultWhisperConfig,
      scheduleTrigger: null
    }
  };
};

/* format app nodes to edit form */
export const appWorkflow2Form = ({ nodes }: { nodes: StoreNodeItemType[] }) => {
  const defaultAppForm = getDefaultAppForm();

  const findInputValueByKey = (inputs: FlowNodeInputItemType[], key: string) => {
    return inputs.find((item) => item.key === key)?.value;
  };

  nodes.forEach((node) => {
    if (
      node.flowNodeType === FlowNodeTypeEnum.chatNode ||
      node.flowNodeType === FlowNodeTypeEnum.tools
    ) {
      defaultAppForm.aiSettings.model = findInputValueByKey(node.inputs, NodeInputKeyEnum.aiModel);
      defaultAppForm.aiSettings.systemPrompt = findInputValueByKey(
        node.inputs,
        NodeInputKeyEnum.aiSystemPrompt
      );
      defaultAppForm.aiSettings.temperature = findInputValueByKey(
        node.inputs,
        NodeInputKeyEnum.aiChatTemperature
      );
      defaultAppForm.aiSettings.maxToken = findInputValueByKey(
        node.inputs,
        NodeInputKeyEnum.aiChatMaxToken
      );
      defaultAppForm.aiSettings.maxHistories = findInputValueByKey(
        node.inputs,
        NodeInputKeyEnum.history
      );
    } else if (node.flowNodeType === FlowNodeTypeEnum.datasetSearchNode) {
      defaultAppForm.dataset.datasets = findInputValueByKey(
        node.inputs,
        NodeInputKeyEnum.datasetSelectList
      );
      defaultAppForm.dataset.similarity = findInputValueByKey(
        node.inputs,
        NodeInputKeyEnum.datasetSimilarity
      );
      defaultAppForm.dataset.limit = findInputValueByKey(
        node.inputs,
        NodeInputKeyEnum.datasetMaxTokens
      );
      defaultAppForm.dataset.searchMode =
        findInputValueByKey(node.inputs, NodeInputKeyEnum.datasetSearchMode) ||
        DatasetSearchModeEnum.embedding;
      defaultAppForm.dataset.usingReRank = !!findInputValueByKey(
        node.inputs,
        NodeInputKeyEnum.datasetSearchUsingReRank
      );
      defaultAppForm.dataset.datasetSearchUsingExtensionQuery = findInputValueByKey(
        node.inputs,
        NodeInputKeyEnum.datasetSearchUsingExtensionQuery
      );
      defaultAppForm.dataset.datasetSearchExtensionModel = findInputValueByKey(
        node.inputs,
        NodeInputKeyEnum.datasetSearchExtensionModel
      );
      defaultAppForm.dataset.datasetSearchExtensionBg = findInputValueByKey(
        node.inputs,
        NodeInputKeyEnum.datasetSearchExtensionBg
      );
    } else if (node.flowNodeType === FlowNodeTypeEnum.systemConfig) {
      const {
        welcomeText,
        variableNodes,
        questionGuide,
        ttsConfig,
        whisperConfig,
        scheduledTriggerConfig
      } = splitGuideModule(getGuideModule(nodes));

      defaultAppForm.userGuide = {
        welcomeText: welcomeText,
        variables: variableNodes,
        questionGuide: questionGuide,
        tts: ttsConfig,
        whisper: whisperConfig,
        scheduleTrigger: scheduledTriggerConfig
      };
    } else if (node.flowNodeType === FlowNodeTypeEnum.pluginModule) {
      if (!node.pluginId) return;

      defaultAppForm.selectedTools.push({
        id: node.pluginId,
        pluginId: node.pluginId,
        name: node.name,
        avatar: node.avatar,
        intro: node.intro || '',
        flowNodeType: node.flowNodeType,
        showStatus: node.showStatus,
        version: '481',
        inputs: node.inputs,
        outputs: node.outputs,
        templateType: FlowNodeTemplateTypeEnum.other
      });
    }
  });

  return defaultAppForm;
};

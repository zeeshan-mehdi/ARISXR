import { XMLParser } from "fast-xml-parser";

export interface BPMNElement {
  id: string;
  name: string;
  type: 'startEvent' | 'endEvent' | 'task' | 'gateway' | 'sequenceFlow';
  description?: string;
  sourceRef?: string;
  targetRef?: string;
  incoming?: string[];
  outgoing?: string[];
  attributes?: Record<string, any>;
}

export interface BPMNProcess {
  id: string;
  name: string;
  elements: BPMNElement[];
  flows: BPMNElement[];
}

export function parseBPMNXML(xmlContent: string): BPMNProcess {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    parseAttributeValue: true,
    trimValues: true,
  });

  const result = parser.parse(xmlContent);
  
  const definitions = result['bpmn:definitions'] || result['definitions'] || result;
  const process = definitions['bpmn:process'] || definitions['process'];
  
  if (!process) {
    throw new Error('No BPMN process found in XML');
  }

  const elements: BPMNElement[] = [];
  const flows: BPMNElement[] = [];

  const extractElements = (obj: any, type: string, bpmnType: BPMNElement['type']) => {
    if (!obj) return;
    const items = Array.isArray(obj) ? obj : [obj];
    items.forEach((item: any) => {
      const element: BPMNElement = {
        id: item['@_id'] || item.id || `${type}-${elements.length}`,
        name: item['@_name'] || item.name || item['@_id'] || 'Unnamed',
        type: bpmnType,
        incoming: [],
        outgoing: [],
        attributes: { ...item },
      };

      const incoming = item['bpmn:incoming'] || item.incoming;
      if (incoming) {
        element.incoming = Array.isArray(incoming) ? incoming : [incoming];
      }

      const outgoing = item['bpmn:outgoing'] || item.outgoing;
      if (outgoing) {
        element.outgoing = Array.isArray(outgoing) ? outgoing : [outgoing];
      }

      elements.push(element);
    });
  };

  const extractFlows = (obj: any) => {
    if (!obj) return;
    const items = Array.isArray(obj) ? obj : [obj];
    items.forEach((item: any) => {
      const flow: BPMNElement = {
        id: item['@_id'] || item.id || `flow-${flows.length}`,
        name: item['@_name'] || item.name || '',
        type: 'sequenceFlow',
        sourceRef: item['@_sourceRef'] || item.sourceRef,
        targetRef: item['@_targetRef'] || item.targetRef,
        attributes: { ...item },
      };
      flows.push(flow);
    });
  };

  extractElements(process['bpmn:startEvent'] || process['startEvent'], 'startEvent', 'startEvent');
  extractElements(process['bpmn:endEvent'] || process['endEvent'], 'endEvent', 'endEvent');
  extractElements(process['bpmn:task'] || process['task'], 'task', 'task');
  extractElements(process['bpmn:userTask'] || process['userTask'], 'userTask', 'task');
  extractElements(process['bpmn:serviceTask'] || process['serviceTask'], 'serviceTask', 'task');
  extractElements(process['bpmn:manualTask'] || process['manualTask'], 'manualTask', 'task');
  extractElements(process['bpmn:exclusiveGateway'] || process['exclusiveGateway'], 'gateway', 'gateway');
  extractElements(process['bpmn:parallelGateway'] || process['parallelGateway'], 'gateway', 'gateway');
  extractElements(process['bpmn:inclusiveGateway'] || process['inclusiveGateway'], 'gateway', 'gateway');
  
  extractFlows(process['bpmn:sequenceFlow'] || process['sequenceFlow']);

  return {
    id: process['@_id'] || process.id || 'process-1',
    name: process['@_name'] || process.name || 'BPMN Process',
    elements,
    flows,
  };
}

export function createSampleBPMN(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                  id="Definitions_1"
                  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" name="Sample Business Process" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Start">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Task_1" name="Review Request">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:exclusiveGateway id="Gateway_1" name="Approved?">
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3</bpmn:outgoing>
      <bpmn:outgoing>Flow_4</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:task id="Task_2" name="Process Approval">
      <bpmn:incoming>Flow_3</bpmn:incoming>
      <bpmn:outgoing>Flow_5</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="Task_3" name="Send Rejection">
      <bpmn:incoming>Flow_4</bpmn:incoming>
      <bpmn:outgoing>Flow_6</bpmn:outgoing>
    </bpmn:task>
    <bpmn:endEvent id="EndEvent_1" name="End">
      <bpmn:incoming>Flow_5</bpmn:incoming>
      <bpmn:incoming>Flow_6</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1"/>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="Gateway_1"/>
    <bpmn:sequenceFlow id="Flow_3" name="Yes" sourceRef="Gateway_1" targetRef="Task_2"/>
    <bpmn:sequenceFlow id="Flow_4" name="No" sourceRef="Gateway_1" targetRef="Task_3"/>
    <bpmn:sequenceFlow id="Flow_5" sourceRef="Task_2" targetRef="EndEvent_1"/>
    <bpmn:sequenceFlow id="Flow_6" sourceRef="Task_3" targetRef="EndEvent_1"/>
  </bpmn:process>
</bpmn:definitions>`;
}

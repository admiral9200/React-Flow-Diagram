import React, { useCallback, useState, useEffect, useMemo } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import uuid from "react-uuid";

import StepNode from "./components/StepNode.jsx";
import TimerNode from "./components/TimerNode.jsx";
import CondNode from "./components/CondNode.jsx";
import FirstNode from "./components/FirstNode.jsx";
import LastNode from "./components/LastNode.jsx";
import ButtonEdge from "./components/ButtonEdge.jsx";

import "./App.css";
import "reactflow/dist/style.css";

const TYPE_COND = "cond";
const TYPE_STEP = "step";
const TYPE_FIRST = "first";
const TYPE_LAST = "last";

const initialNodes = [
  {
    id: "first-node",
    type: "FirstNode",
    position: { x: 0, y: -150 },
    data: {},
  },
  {
    id: "node-1",
    type: "StepNode",
    position: { x: 0, y: 0 },
    data: { label: "1. Email" },
  },
  {
    id: "node-2",
    type: "TimerNode",
    position: { x: 0, y: 150 },
    data: { label: "2. Timer" },
  },
  {
    id: "node-3",
    type: "StepNode",
    position: { x: 0, y: 300 },
    data: { label: "3. Has Email Address" },
  },
  {
    id: "node-4",
    type: "StepNode",
    position: { x: -180, y: 450 },
    data: { label: "3. Has Email Address" },
  },
  {
    id: "node-5",
    type: "StepNode",
    position: { x: 180, y: 450 },
    data: { label: "3. Has Email Address" },
  },
  {
    id: "node-6",
    type: "LastNode",
    position: { x: -15, y: 600 },
  },
  {
    id: "node-7",
    type: "LastNode",
    position: { x: 345, y: 600 },
  },
];
const initialEdges = [
  {
    id: "edge-button-first",
    source: "first-node",
    target: "node-1",
    type: "buttonedge",
  },
  {
    id: "edge-button1",
    source: "node-1",
    target: "node-2",
    type: "buttonedge",
  },
  {
    id: "edge-button2",
    source: "node-2",
    target: "node-3",
    type: "buttonedge",
  },
  {
    id: "edge-button3",
    source: "node-3",
    target: "node-4",
  },
  {
    id: "edge-button4",
    source: "node-3",
    target: "node-5",
  },
  { id: "e4-6", source: "node-4", target: "node-6", label: "Yes" },
  { id: "e5-7", source: "node-5", target: "node-7", label: "No " },
];

export default function App() {
  const nodeTypes = useMemo(
    () => ({
      StepNode: StepNode,
      TimerNode: TimerNode,
      CondNode: CondNode,
      FirstNode: FirstNode,
      LastNode: LastNode,
    }),
    []
  );

  const flowTypes = {
    first: "FirstNode",
    step: "StepNode",
    cond: "CondNode",
    last: "LastNode",
  };

  const edgeTypes = {
    buttonedge: ButtonEdge,
  };

  const [index, setIndex] = useState(null);
  const [panelClass, setPanelClass] = useState("show-action-panel");
  const [actionPanelType, setActionPanelType] = useState("step");
  const [flowInfos, setFlowInfos] = useState([]);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const [insertPrev, setInsertPrev] = useState(null);
  const [insertNext, setInsertNext] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addAction = (actionIndex) => {
    setIndex(actionIndex);
    setPanelClass("show-action-panel");
    setActionPanelType("step");
  };

  const handlePanelAction = (e) => {
    if (e.keyCode == 49) setPanelClass("show-flow-panel");
    else if (e.keyCode == 50) setPanelClass("show-action-panel");
  };

  const edgeActionInsert = (indexId) => {
    setIndex(indexId);
    setPanelClass("show-action-panel");
    setActionPanelType("step");
  }

  const actionAddStep = (e) => {
    let label = e.target.innerText;
    setPanelClass("show-flow-panel");
    setActionPanelType("step");

    if (insertPrev && insertNext) {
      insertFlow(insertPrev, insertNext, { type: TYPE_STEP, time: true, label });
      setInsertPrev(null);
      setInsertNext(null);
    } else {
      if (!index) {
        let newFlowId = uuid();
        setFlowInfos([
          { id: "first-node", next: [newFlowId], type: "first" },
          {
            id: newFlowId,
            type: TYPE_STEP,
            time: false,
            prev: "first-node",
            next: [],
            label
          },
        ]);
      } else {
        addFlow(index, { type: TYPE_STEP, time: true, label });
        setIndex(null);
      }
    }
  };

  const insertAction = (source, target) => {
    setInsertPrev(source);
    setInsertNext(target);
    setPanelClass("show-action-panel");
    setActionPanelType("step");
  }

  const actionAddCondition = (e) => {
    let label = e.target.innerText;
    setPanelClass("show-flow-panel");
    setActionPanelType("step");
    if (!index) {
      let newFlowId = uuid();
      setFlowInfos([
        { id: "first-node", next: [newFlowId], type: "first" },
        {
          id: newFlowId,
          type: TYPE_COND,
          time: false,
          prev: "first-node",
          next: [],
          label
        },
      ]);
    } else {
      if (index) {
        addFlow(index, { type: TYPE_COND, label });
        setIndex(null);
        return;
      }
      if (insertPrev && insertNext) {
        insertFlow(insertPrev, insertNext, { type: TYPE_COND, time: false, label: "Inserted Row" });
        setInsertPrev(null);
        setInsertNext(null);
        return;
      }


    }
  };

  const addFlow = (prev, data) => {
    let prevFlow = getFlow(prev);
    let newFlowInfos = flowInfos;
    let newId = uuid();

    if (prevFlow.type === TYPE_STEP) {
      prevFlow = { ...prevFlow, next: [newId] };
      newFlowInfos = flowInfos.map((item) =>
        item.id === prev ? prevFlow : item
      );
      newFlowInfos.push({ ...data, id: newId, prev: prevFlow.id, next: [] });
    } else if (prevFlow.type === TYPE_COND) {
      prevFlow = {
        ...prevFlow,
        next: !prevFlow.next ? [newId] : prevFlow.next.concat([newId]),
      };
      newFlowInfos = flowInfos.map((item) =>
        item.id === prev ? prevFlow : item
      );
      newFlowInfos.push({ ...data, id: newId, prev: prevFlow.id, next: [] });
    }

    setFlowInfos(newFlowInfos);
  };

  const deleteFlow = (indexId) => {
    let curStepInfo = getFlow(indexId);
    if (curStepInfo.type === TYPE_STEP) {
      deleteStepFlow(indexId);
    } else if (curStepInfo.type === TYPE_COND) {
      deleteCondFlow(indexId);
    }
  };

  const deleteStepFlow = (indexId) => {
    let delFlowInfo = getFlow(indexId);

    let newFlowInfos = flowInfos
      .map((item) => {
        if (item.id === delFlowInfo.prev)
          return { ...item, next: delFlowInfo.next };
        else if (item.id === delFlowInfo.next[0])
          return { ...item, prev: delFlowInfo.prev };
        else return item;
      })
      .filter((item) => item.id !== indexId);

    setFlowInfos(newFlowInfos);
  };

  const deleteCondFlow = (indexId) => {
    let toDelFlowIds = [indexId];
    let tmpDelFlowIds = [];
    let toDelCondFlow = getFlow(indexId);

    while (toDelFlowIds.length !== 0) {
      let delFlowId = toDelFlowIds.pop();
      tmpDelFlowIds.push(delFlowId);

      let delFlowNode = getFlow(delFlowId);
      if (!delFlowNode.next)
        toDelFlowIds = toDelFlowIds.concat(delFlowNode.next);
    }

    let newFlowInfos = flowInfos.filter(
      (item) => !tmpDelFlowIds.includes(item.id)
    );

    newFlowInfos = newFlowInfos.map((item) =>
      item.id === toDelCondFlow.prev ? { ...item, next: [] } : item
    );
    setFlowInfos(newFlowInfos);
  };

  const insertFlow = (prev, next, data) => {
    let newFlowId = uuid();
    let prevFlowInfo = getFlow(prev);
    let newFlowInfos = [];
    if (prevFlowInfo.type === TYPE_STEP) {
      newFlowInfos = flowInfos.map((item) =>
        item.id === prev ? { ...item, next: [newFlowId] } : item
      );
      newFlowInfos = newFlowInfos.map((item) =>
        item.id === next ? { ...item, prev: newFlowId } : item
      );
      newFlowInfos.push({ id: newFlowId, ...data, prev: prev, next: [next] });
    }
    setFlowInfos(newFlowInfos);
  };

  const getFlow = (indexId) => {
    if (!indexId) return {};
    let step = flowInfos.filter((item) => item.id === indexId);
    if (step.length === 1) return step[0];
    else return false;
  };

  useEffect(() => {
    if (!flowInfos.length) return;

    let newNodes = [];
    let newEdges = [];

    let startPosX = 800;
    let startPosY = 50;

    let posX = startPosX;
    let posY = startPosY;

    let stepSizeY = 50;
    let stepSizeX = 360;
    let stepHeight = 150;
    let tmpPosArr = [];
    let tmpLabelArr = [];
    let tmpCondArr = [];
    let labelIndex = 1;
    let labelPrefix = "";

    let flowInfosTmp = ["first-node"];
    while (flowInfosTmp.length !== 0) {
      let popIndex = flowInfosTmp.shift();
      let flowInfo = getFlow(popIndex);

      if (flowInfo.type === TYPE_FIRST) {
        //first node generate
        newNodes.push({
          id: flowInfo.id,
          type: flowTypes[flowInfo.type],
          position: { x: posX, y: posY },
          data: {},
        });
        posY += stepHeight;
      } else if (flowInfo.type === TYPE_STEP) {
        //step nodes, edges generate
        // generate nodes
        if (flowInfo.time) {
          newNodes.push({
            id: `${flowInfo.id}time`,
            type: "TimerNode",
            position: { x: posX, y: posY },
            data: {},
          });
          posY += stepHeight;
        }
        newNodes.push({
          id: flowInfo.id,
          type: flowTypes[flowInfo.type],
          position: { x: posX, y: posY },
          data: {
            label: labelPrefix + labelIndex + `. ${flowInfo.label}`,
            deleteFlow,
            id: flowInfo.id,
          },
        });

        // generate edges
        let prevFlowInfo = getFlow(flowInfo.prev);
        if (prevFlowInfo.type === TYPE_COND) {
          if (flowInfo.time) {
            newEdges.push({
              id: `edge-${flowInfo.prev}--${flowInfo.id}time`,
              source: flowInfo.prev,
              target: `${flowInfo.id}time`,
              label: prevFlowInfo.next[0] === flowInfo.id ? "Yes" : "No"
            });
            newEdges.push({
              id: `edge-${flowInfo.id}time--${flowInfo.id}`,
              source: `${flowInfo.id}time`,
              target: flowInfo.id
            });
          } else {
            newEdges.push({
              id: `edge-${flowInfo.prev}--${flowInfo.id}`,
              source: flowInfo.prev,
              target: flowInfo.id,
              type: "buttonedge",
            });
          }
        } else {
          if (flowInfo.time) {
            newEdges.push({
              id: `edge-${flowInfo.prev}--${flowInfo.id}time`,
              source: flowInfo.prev,
              target: `${flowInfo.id}time`,
              type: "buttonedge",
              data: { insertAction }
            });
            newEdges.push({
              id: `edge-${flowInfo.id}time--${flowInfo.id}`,
              source: `${flowInfo.id}time`,
              target: flowInfo.id,
            });
          } else {
            newEdges.push({
              id: `edge-${flowInfo.prev}--${flowInfo.id}`,
              source: flowInfo.prev,
              target: flowInfo.id,
              type: "buttonedge",
            });
          }
        }


        // generate add button when reach last
        if (flowInfo.next.length === 0) {
          posY += stepHeight;
          newNodes.push({
            id: `${flowInfo.id}last`,
            type: "LastNode",
            position: { x: posX + stepSizeX / 2 - 12.5, y: posY },
            data: { addActionLast: () => addAction(flowInfo.id) },
          });
          newEdges.push({
            id: `edge-${flowInfo.id}-${flowInfo.id}last`,
            source: flowInfo.id,
            target: `${flowInfo.id}last`,
          });
        }
        // pos forward
        posY += stepHeight;
        labelIndex++;
      } else if (flowInfo.type === TYPE_COND) {
        //cond nodes, edges generate
        // node, edge generate
        newNodes.push({
          id: flowInfo.id,
          type: flowTypes[flowInfo.type],
          position: { x: posX, y: posY },
          data: {
            label: labelPrefix + labelIndex + `. ${flowInfo.label}`,
            deleteFlow,
            id: flowInfo.id,
          },
        });
        newEdges.push({
          id: `edge-${flowInfo.prev}--${flowInfo.id}`,
          source: flowInfo.prev,
          target: flowInfo.id,
          type: "buttonedge",
          data: "123"
        });

        // generate add button when reach last
        if (flowInfo.next.length === 0) {
          newNodes.push({
            id: `${flowInfo.id}leftlast`,
            type: "LastNode",
            position: { x: posX - 12.5, y: posY + stepHeight },
            data: { addActionLast: () => addAction(flowInfo.id) },
          });
          newEdges.push({
            id: `edge-${flowInfo.id}--${flowInfo.id}leftlast`,
            source: flowInfo.id,
            target: `${flowInfo.id}leftlast`,
          });

          newNodes.push({
            id: `${flowInfo.id}rightlast`,
            type: "LastNode",
            position: { x: posX - 12.5 + stepSizeX, y: posY + stepHeight },
            data: { addActionLast: () => addAction(flowInfo.id) },
          });
          newEdges.push({
            id: `edge-${flowInfo.id}--${flowInfo.id}rightlast`,
            source: flowInfo.id,
            target: `${flowInfo.id}rightlast`,
          });
        } else if (flowInfo.next.length === 1) {
          newNodes.push({
            id: `${flowInfo.id}rightlast`,
            type: "LastNode",
            position: { x: posX + stepSizeX - 12.5, y: posY + stepHeight },
            data: { addActionLast: () => addAction(flowInfo.id) },
          });
          newEdges.push({
            id: `edge-${flowInfo.id}--${flowInfo.id}rightlast`,
            source: flowInfo.id,
            target: `${flowInfo.id}rightlast`,
          });
        }

        // pos forward
        posY += stepHeight;
        posX -= stepSizeX / 2;

        if (flowInfo.next.length === 2) {
          tmpPosArr.push({ posX: posX + stepSizeX, posY });
          tmpLabelArr.push({
            labelPrefix: labelPrefix + labelIndex + ".B.",
            labelIndex: 1,
          });
        }

        labelPrefix = labelPrefix + labelIndex + ".A.";
        labelIndex = 1;
      }

      // generate next step data
      if (flowInfo.next.length !== 0) {
        // add child flow into queue to generate nodes
        flowInfosTmp = flowInfo.next.concat(flowInfosTmp);
      } else if (flowInfosTmp.length !== 0) {
        // pos correction when reach last
        let tmpPos = tmpPosArr.pop();
        posX = tmpPos.posX;
        posY = tmpPos.posY;

        let tmpLabel = tmpLabelArr.pop();
        labelPrefix = tmpLabel.labelPrefix;
        labelIndex = tmpLabel.labelIndex;
      }

    }
    setNodes(newNodes);
    setEdges(newEdges);

    const extractedData = newNodes.map(obj => {
      return {
        id: obj.id,
        type: obj.type,
        label: obj.data.label
      };
    });

    console.log("new: ", extractedData);
  }, [flowInfos]);

  return (
    <div
      onKeyDown={handlePanelAction}
      style={{ width: "100vw", height: "100vh" }}
      className={panelClass}
    >
      <ReactFlow
        id="flow-panel"
        onKeyDown={handlePanelAction}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>

      <div id="action-panel">
        <div id="action-type">
          <div className="button-group">
            <button
              className={"btn-add-step" + (actionPanelType === "step" ? " active" : "")}
              onClick={() => setActionPanelType("step")}
            >
              Add Step
            </button>
            <button
              className={"btn-add-step" + (actionPanelType === "cond" ? " active" : "")}
              onClick={() => setActionPanelType("cond")}
            >
              Add Condition
            </button>
          </div>
        </div>

        {actionPanelType === "step" && (
          <div id="action-step-panel">
            <div id="action-top">
              <h3>Automatic Steps</h3>
              <div className="button-group">
                <button className="btn-add-step" onClick={actionAddStep}>
                  Email
                </button>
                <button className="btn-add-step" onClick={actionAddStep}>
                  Linkedin1
                </button>
                <button className="btn-add-step" onClick={actionAddStep}>
                  Linkedin2
                </button>
                <button className="btn-add-step" onClick={actionAddStep}>
                  Linkedin3
                </button>
              </div>
            </div>
            <div id="action-bottom">
              <div id="action-bototm-left">
                <h3>Manual Exception</h3>
                <div className="button-group">
                  <button className="btn-add-step" onClick={actionAddStep}>
                    Steps
                  </button>
                  <button className="btn-add-step" onClick={actionAddStep}>
                    Condition
                  </button>
                </div>
              </div>
              <div id="action-bototm-right">
                <h3>Other Steps</h3>
                <div className="button-group">
                  <button className="btn-add-step" onClick={actionAddStep}>
                    Steps
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {actionPanelType === "cond" && (
          <div id="action-cond-panel">
            <div id="action-top">
              <p>
                Add conditions to your sequence and create decisions branches to
                get the best results possible
              </p>
              <h3>Lead information</h3>
              <div className="button-group">
                <button className="btn-add-step" onClick={actionAddCondition}>
                  Has Email Adress
                </button>
                <button className="btn-add-step" onClick={actionAddCondition}>
                  Has Linkedin URL
                </button>
                <button className="btn-add-step" onClick={actionAddCondition}>
                  Accepted invite
                </button>
              </div>
            </div>
            <div id="action-bottom">
              <div id="action-bototm-left">
                <h3>Lead actions</h3>
                <div className="button-group">
                  <button className="btn-add-step" onClick={actionAddCondition}>
                    Opened email
                  </button>
                  <button className="btn-add-step" onClick={actionAddCondition}>
                    Clicked on link in email
                  </button>
                  <button className="btn-add-step" onClick={actionAddCondition}>
                    Unsubscribe from email
                  </button>
                  <button className="btn-add-step" onClick={actionAddCondition}>
                    Booked a meeting
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

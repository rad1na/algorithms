import React, { useState } from "react";
import {
  Divider,
  Form,
  InputNumber,
  Button,
  Row,
  Col,
  message,
  Timeline,
  notification,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import styles from "./KruskalComponent.module.css";
import { Stage, Layer, Text, Circle, Line } from "react-konva";
import { kruskalSet } from "./set";

const minimalEdge = (edges) => {
  let min = null;
  for (const item of edges) {
    min = min ? (item[2] < min[2] ? item : min) : item;
  }
  return min;
};

const getMst = (edges, lines) => {
  let finalArr = [];
  let edgesCopy = edges.slice(0);
  let set1 = kruskalSet;
  set1.make(lines);
  while (finalArr.length < lines.length - 1) {
    let min = minimalEdge(edgesCopy);
    if (set1.union(lines[min[0]], lines[min[1]])) {
      finalArr.push(min);
    }
    edgesCopy.splice(edgesCopy.indexOf(min), 1);
  }
  return finalArr;
};

export const KruskalComponent = (props) => {
  const [positions, setPositions] = useState([]);
  const [numOfNodes, setNumOfNodes] = useState(5);
  const [disabled, setDisabled] = useState(false);
  const [drawLines, setDrawLines] = useState(false);
  const [lines, setLines] = useState([]);
  const [form] = Form.useForm();

  const calculateDistances = (node) => {
    const { left, top, index } = node;
    let distances = positions
      .map((el) => {
        if (el.index !== index) {
          let elLeft = Math.abs(left - el.left);
          let elTop = Math.abs(top - el.top);
          if (elLeft === 0)
            return { index: el.index, distance: Math.sqrt(Math.pow(elTop, 2)) };
          else if (elTop === 0)
            return {
              index: el.index,
              distance: Math.sqrt(Math.pow(elLeft, 2)),
            };
          else
            return {
              index: el.index,
              distance: Math.sqrt(Math.pow(elTop, 2) + Math.pow(elLeft, 2)),
            };
        } else {
          return null;
        }
      })
      .filter((el) => !!el);
    return distances;
  };

  const generateLine = (first, second) => {
    return (
      <Line
        points={[first.left, first.top, second.left, second.top]}
        stroke="red"
        strokeWidth={4}
        lineCap="round"
        lineJoin="round"
      />
    );
  };

  const resetFields = () => {
    form.setFieldsValue({ nodes: 5, starting: 1 });
    setPositions([]);
    setNumOfNodes(5);
    setDisabled(false);
    setDrawLines(false);
    setLines([]);
  };

  const findMst = () => {
    setDisabled(true);
    let distancesSorted = [];
    let nodesIncluded = [];
    let sets = [];
    let path = [];
    let newLines = [];
    setPositions(
      positions.map((el) => {
        el.distances = calculateDistances(el);
        return el;
      })
    );
    positions.forEach((pos) => {
      pos.distances.forEach((dist) => {
        if (!distancesSorted.includes({}))
          distancesSorted.push({
            from: pos.index,
            to: dist.index,
            distance: dist.distance,
          });
      });
    });
    distancesSorted = distancesSorted
      .sort((a, b) => {
        return a.distance - b.distance;
      })
      .filter((el, index) => index % 2 !== 0);
    console.log(distancesSorted, "distance");
    let circles = () => {
      let arr = [];
      for (let i = 0; i < numOfNodes; i++) arr.push(i);
      return arr;
    };
    let edges = () => {
      let arr = [];
      distancesSorted.forEach((dist) =>
        arr.push([dist.from, dist.to, dist.distance])
      );
      return arr;
    };
    let kruskalResult = getMst(edges(), circles());
    kruskalResult.forEach((el) => {
      let pos1 = positions.filter((elem) => elem.index === el[0])[0];
      let pos2 = positions.filter((elem) => elem.index === el[1])[0];
      newLines.push(generateLine(pos1, pos2));
    });
    console.log(kruskalResult, "TREE");
    console.log(positions, "pos");
    console.log(distancesSorted, "SORTED");
    console.log(sets, "SETS");
    console.log(path, "PATH");
    console.log(nodesIncluded, "nodes");
    setLines(newLines);
    setDrawLines(true);
    notification.open({
      duration: 0,
      message: "Redosled",
      description: (
        <Timeline style={{ marginTop: "2rem" }}>
          {kruskalResult.map((el) => (
            <Timeline.Item color="red">{`${el[0]} → ${
              el[1]
            } ; distanca ≈ ${parseInt(el[2])}px`}</Timeline.Item>
          ))}
        </Timeline>
      ),
    });
  };

  return (
    <div>
      <Divider>Kruskalov Algoritam</Divider>
      <Row justify="center" style={{ width: "100%" }}>
        <Col span={16} style={{ display: "flex", justifyContent: "center" }}>
          <Form layout={"inline"} size="large" form={form}>
            <Form.Item
              label="Unesite broj čvorova"
              name="nodes"
              initialValue={5}
            >
              <InputNumber
                min={2}
                max={10}
                onChange={(val) => setNumOfNodes(val)}
                disabled={disabled}
              />
            </Form.Item>
            <Button size="large" type="primary" onClick={findMst}>
              Pronađi MST
            </Button>
            <Button
              type="primary"
              onClick={resetFields}
              danger
              icon={<DeleteOutlined />}
              style={{ marginLeft: "1rem" }}
            />
          </Form>
        </Col>
      </Row>
      <Stage
        width={800}
        height={600}
        onClick={(e) =>
          positions.length < numOfNodes
            ? setPositions([
                ...positions,
                {
                  left: e.evt.offsetX,
                  top: e.evt.offsetY,
                  index: positions.length,
                },
              ])
            : message.warning("Ne možete dodavati više čvorova")
        }
        className={styles.canvasWrapper}
      >
        <Layer>
          {positions.length ? (
            positions.map((el, index) => (
              <>
                <Circle
                  key={index}
                  x={el.left}
                  y={el.top}
                  width={50}
                  height={50}
                  stroke="black"
                  strokeWidth={3}
                />
                <Text
                  fontSize={16}
                  x={el.left - 5}
                  y={el.top + 35}
                  text={el.index}
                />
              </>
            ))
          ) : (
            <Text text="Kliknite da biste dodali čvorista" x={10} y={10} />
          )}
          {lines.length && drawLines ? lines.map((el) => el) : null}
        </Layer>
      </Stage>
    </div>
  );
};

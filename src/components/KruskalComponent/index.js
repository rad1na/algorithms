import React, { useState } from "react";
import {
  Divider,
  Form,
  InputNumber,
  Button,
  Row,
  Col,
  message,
  Select,
  Timeline,
  notification,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import styles from "./KruskalComponent.module.css";
import { Stage, Layer, Text, Circle, Line } from "react-konva";

const { Option } = Select;

export const KruskalComponent = (props) => {
  const [positions, setPositions] = useState([]);
  const [numOfNodes, setNumOfNodes] = useState(5);
  const [disabled, setDisabled] = useState(false);
  const [drawLines, setDrawLines] = useState(false);
  const [lines, setLines] = useState([]);
  const [finalNodesArray, setFinalNodesArray] = useState([]);
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
    console.log();
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
    // while (nodesIncluded.length !== numOfNodes || distancesSorted.length) {
    if (!nodesIncluded.length) {
      nodesIncluded = [distancesSorted[0].from, distancesSorted[0].to];
      sets.push([distancesSorted[0].from, distancesSorted[0].to]);
      path.push(distancesSorted[0]);
      distancesSorted.shift();
    } else {
    }
    // }
    console.log(positions, "pos");
    console.log(distancesSorted, "SORTED");
    console.log(sets, "SETS");
    console.log(path, "PATH");
  };

  return (
    <div>
      <Divider>Kruskalov Algoritam</Divider>
      <Row justify="center" style={{ width: "100%" }}>
        <Col span={16} style={{ display: "flex", justifyContent: "center" }}>
          <Form layout={"inline"} size="large" form={form}>
            <Form.Item
              label="Unesite broj cvorova"
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
              Pronadji MST
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
            : message.warning("Ne mozete dodavati vise cvorova")
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
            <Text text="Kliknite da biste dodali cvorista" x={10} y={10} />
          )}
          {lines.length && drawLines ? lines.map((el) => el) : null}
        </Layer>
      </Stage>
    </div>
  );
};

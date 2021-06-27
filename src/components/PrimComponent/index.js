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
import styles from "./PrimComponent.module.css";
import { Stage, Layer, Text, Circle, Line } from "react-konva";

const { Option } = Select;

export const PrimComponent = (props) => {
  const [positions, setPositions] = useState([]);
  const [numOfNodes, setNumOfNodes] = useState(5);
  const [startingNode, setStartingNode] = useState(1);
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
    setStartingNode(1);
    setDisabled(false);
    setDrawLines(false);
    setLines([]);
  };

  const findMst = () => {
    setDisabled(true);
    let newArr = [];
    let newLines = [];
    let arrOfShortestDistances = [];
    let path = [];
    while (newArr.length !== numOfNodes) {
      if (newArr.length === 0) {
        setPositions(
          positions.map((el) => {
            el.distances = calculateDistances(el);
            return el;
          })
        );
        console.log(positions, "pos");
        let startingNodeEl = positions[startingNode];
        let shortestDistance = Math.min(
          ...startingNodeEl.distances.map((el) => el.distance)
        );
        arrOfShortestDistances.push(shortestDistance);
        console.log(arrOfShortestDistances);
        console.log(startingNodeEl, "staring", shortestDistance, "Shortest");
        let filteredEl = positions.filter(
          (el) =>
            el.index ===
            startingNodeEl.distances.filter(
              (el) => el.distance === shortestDistance
            )[0].index
        )[0];
        console.log(filteredEl, "filtered");
        newArr = [startingNodeEl.index, filteredEl.index];
        path.push({
          from: startingNodeEl.index,
          to: filteredEl.index,
          distance: shortestDistance,
        });
        newLines.push(generateLine(startingNodeEl, filteredEl));
        // let newPos = positions.map((el) => {
        //   if (el.index === startingNodeEl.index)
        //     el.distances = el.distances.filter((el) => el !== filteredEl.index);
        //   else if (el.index === filteredEl.index)
        //     el.distances = el.distances.filter(
        //       (el) => el !== startingNodeEl.index
        //     );
        //   else return el;
        // });
        // setPositions(newPos);
      } else {
        console.log(newArr, "Trenutni clanovi");
        let positionsLeft = positions
          .map((el) => {
            if (newArr.includes(el.index)) return el;
          })
          .filter((el) => !!el);
        console.log(positionsLeft);
        let onlyDistances = [];
        positionsLeft.forEach((pos) => {
          pos.distances.forEach((dist) => {
            if (!arrOfShortestDistances.includes(dist.distance))
              onlyDistances.push(dist.distance);
          });
        });
        console.log(onlyDistances);

        let shortestDistance = Math.min(...onlyDistances);
        // if (arrOfShortestDistances.includes(shortestDistance)) {
        //   shortestDistance = Math.min(
        //     ...onlyDistances.filter((el) => el !== shortestDistance)
        //   );
        arrOfShortestDistances.push(shortestDistance);
        // } else arrOfShortestDistances.push(shortestDistance);
        // console.log(arrOfShortestDistances, "SHORTEST");
        positionsLeft.forEach((pos) => {
          let checkIfIncludesDistance = pos.distances.filter(
            (dist) => dist.distance === shortestDistance
          );
          if (checkIfIncludesDistance.length) {
            newArr.push(checkIfIncludesDistance[0].index);
            let pos1 = positions.filter((el) => el.index === pos.index)[0];
            let pos2 = positions.filter(
              (el) => el.index === checkIfIncludesDistance[0].index
            )[0];
            path.push({
              to: pos2.index,
              from: pos1.index,
              distance: shortestDistance,
            });
            newLines.push(generateLine(pos1, pos2));
          }
        });
      }
    }
    setFinalNodesArray(newArr);
    setLines(newLines);
    setDrawLines(true);
    console.log(path, "PATH");
    notification.open({
      duration: 0,
      message: "Redosled",
      description: (
        <Timeline style={{ marginTop: "2rem" }}>
          {path.map((el) => (
            <Timeline.Item color="red">{`${el.from} → ${
              el.to
            } ; distanca ≈ ${parseInt(el.distance)}px`}</Timeline.Item>
          ))}
        </Timeline>
      ),
    });
  };

  const renderOptions = () => {
    let arrOfElems = [];
    let i = 0;
    while (i < numOfNodes) {
      arrOfElems.push(<Option value={i}>{i}</Option>);
      i++;
    }
    return arrOfElems;
  };

  return (
    <div>
      <Divider>Primov Algoritam</Divider>
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
            <Form.Item
              label="Izaberite pocetni cvor"
              name="starting"
              initialValue={1}
            >
              <Select
                defaultValue={1}
                style={{ width: 120 }}
                onSelect={(val) => setStartingNode(val)}
                disabled={disabled}
              >
                {renderOptions()}
              </Select>
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

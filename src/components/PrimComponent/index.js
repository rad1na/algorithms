import React, { useState } from 'react';
import { Divider, Form, InputNumber, Button, Row, Col, message, Select } from 'antd';
import styles from './PrimComponent.module.css';
import { Stage, Layer, Rect, Text, Circle, Line } from 'react-konva';

const { Option } = Select;

export const PrimComponent = (props) => {
  const [positions, setPositions] = useState([]);
  const [positionsWithDistances, setPositionsWithDistances] = useState([]);
  const [numOfNodes, setNumOfNodes] = useState(5);
  const [startingNode, setStartingNode] = useState(1);
  const [disabled, setDisabled] = useState(false);
  const [drawLines, setDrawLines] = useState(false);
  const [lines, setLines] = useState([]);
  const [finalNodesArray, setFinalNodesArray] = useState([]);

  const calculateDistances = (node) => {
    const { left, top, index } = node;
    let distances = positions
      .map((el) => {
        if (el.index !== index) {
          let elLeft = Math.abs(left - el.left);
          let elTop = Math.abs(top - el.top);
          if (elLeft === 0) return { index: el.index, distance: Math.sqrt(Math.pow(elTop, 2)) };
          else if (elTop === 0) return { index: el.index, distance: Math.sqrt(Math.pow(elLeft, 2)) };
          else return { index: el.index, distance: Math.sqrt(Math.pow(elTop, 2) + Math.pow(elLeft, 2)) };
        } else {
          return null;
        }
      })
      .filter((el) => !!el);
    return distances;
  };

  const generateLine = (first, second) => {
    setLines([
      ...lines,
      <Line points={(first.left, first.top, second.left, second.top)} stroke="red" strokeWidth={2} lineCap="round" lineJoin="round" />
    ]);
  };

  const findCloserPoint = (startingPoint) => {
    const { left, top, index } = startingPoint;
    let distances = positions.map((el) => {
      if (el.index !== index) {
        let elLeft = Math.abs(left - el.left);
        let elTop = Math.abs(top - el.top);
        console.log(elLeft, elTop);
        if (elLeft === 0) return { left: el.left, top: el.top, index, distance: Math.sqrt(Math.pow(elTop, 2)) };
        else if (elTop === 0) return { left: el.left, top: el.top, index, distance: Math.sqrt(Math.pow(elLeft, 2)) };
        else return { left: el.left, top: el.top, index, distance: Math.sqrt(Math.pow(elTop, 2) + Math.pow(elLeft, 2)) };
      } else {
        return null;
      }
    });
    console.log(distances);
    setPositionsWithDistances(distances.filter((el) => !!el));
  };

  const findMst = () => {
    setDisabled(true);
    let newArr = [];
    while (newArr.length !== numOfNodes) {
      if (newArr.length === 0) {
        setPositions(
          positions.map((el) => {
            el.distances = calculateDistances(el);
            return el;
          })
        );
        console.log(positions, 'pos');
        let startingNodeEl = positions[startingNode];
        let shortestDistance = Math.min(...startingNodeEl.distances.map((el) => el.distance));
        console.log(startingNodeEl, 'staring', shortestDistance, 'Shortest');
        let filteredEl = positions.filter(
          (el) => el.index === startingNodeEl.distances.filter((el) => el.distance === shortestDistance)[0].index
        )[0];
        console.log(filteredEl, 'filtered');
        newArr = [startingNodeEl.index, filteredEl.index];
        generateLine(startingNodeEl, filteredEl);
        setPositions(
          positions.map((el) => {
            if (el.index === startingNodeEl.index) el.distances = el.distances.filter((el) => el !== filteredEl.index);
            else if (el.index === filteredEl.index) el.distances = el.distances.filter((el) => el !== startingNodeEl.index);
            else return el;
          })
        );
      } else {
        console.log(newArr, 'ELSE');

        let multipleDistances = newArr.map((number) => {
          return positions
            .map((el) => {
              if (el.index === number) return el.distances;
            })
            .filter((el) => !!el);
        });

        let onlyDistanceValues = [];
        multipleDistances.forEach((val) => {
          console.log(val);
          val[0].forEach((el) => onlyDistanceValues.push(el.distance));
        });
        console.log(multipleDistances, 'MULTIPLE');
        console.log('only distances', onlyDistanceValues);
        let shortestDistance = Math.min(...onlyDistanceValues);

        let nextNode = multipleDistances.filter((el) => {
          let filtered = el.forEach((val) => {
            return val.filter((inner) => inner.distance === shortestDistance)[0];
          });
          console.log(filtered, 'test');
          if (filtered.length) return filtered[0];
        });
        console.log(nextNode);
        if (newArr.includes(nextNode[0].indexFrom)) newArr.push(nextNode[0].indexFrom);
        else newArr.push(nextNode[1].indexFrom);
        setPositions(
          positions.map((el) => {
            el.distances = el.distances.filter((el) => {
              let flag = false;
              newArr.forEach((node) => {
                if (el.includes(node)) {
                  flag = true;
                }
              });
              if (!flag) return el;
            });
          })
        );
        // generateLine(positions[nextNode.indexFrom], multipleDistances.filter(el => el.distances.includes(shortestDistance))[0]);
      }
    }
    setFinalNodesArray(newArr);
    console.log(newArr);
  };

  const handleButtonClick = () => {
    while (finalNodesArray.length !== numOfNodes.length) {
      findMst();
    }
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
      <Row justify="center" style={{ width: '100%' }}>
        <Col span={16} style={{ display: 'flex', justifyContent: 'center' }}>
          <Form layout={'inline'} size="large">
            <Form.Item label="Unesite broj cvorova" name="nodes" initialValue={5}>
              <InputNumber min={2} max={10} onChange={(val) => setNumOfNodes(val)} disabled={disabled} />
            </Form.Item>
            <Form.Item label="Izaberite pocetni cvor" name="starting" initialValue={1}>
              <Select defaultValue={1} style={{ width: 120 }} onSelect={(val) => setStartingNode(val)} disabled={disabled}>
                {renderOptions()}
              </Select>
            </Form.Item>
            <Button size="large" type="primary" onClick={findMst}>
              Pronadji MST
            </Button>
          </Form>
        </Col>
      </Row>

      <Stage
        width={800}
        height={600}
        onClick={(e) =>
          positions.length < numOfNodes
            ? setPositions([...positions, { left: e.evt.offsetX, top: e.evt.offsetY, index: positions.length }])
            : message.warning('Ne mozete dodavati vise cvorova')
        }
        className={styles.canvasWrapper}
      >
        <Layer>
          {positions.length ? (
            positions.map((el, index) => (
              <>
                <Circle key={index} x={el.left} y={el.top} width={50} height={50} stroke="black" strokeWidth={3} />
                <Text fontSize={16} x={el.left - 5} y={el.top + 35} text={el.index} />
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

/* <canvas
        //className={styles.algorithmWrapper}
        onClick={(e) => {
          e.target.width = '100%';
          let wrapperPos = e.target.getBoundingClientRect();
          let offset = { top: wrapperPos.top + window.scrollY, left: wrapperPos.left + window.scrollX };
          console.log('Location', e.pageX, e.pageY);
          console.log(e);
          //   let newNode = window.document.createElement('div');
          //   newNode.classList.add('nodeWrapper');
          //   newNode.style.left = `${e.pageX - offset.left - 25}px`;
          //   newNode.style.top = `${e.pageY - offset.top - 25}px`;
          //   e.target.appendChild(newNode);
          if (e.target.getContext) {
            let ctx = e.target.getContext('2d');
            ctx.beginPath();
            ctx.arc(100, 75, 50, 0, 2 * Math.PI);
            ctx.stroke();
          }
        }}
        style={{ width: '100%', border: '2px solid black' }}
      ></canvas> */

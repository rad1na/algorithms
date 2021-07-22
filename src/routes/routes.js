import React from "react";
import { Route } from "react-router-dom";
import {
  DotChartOutlined,
  RadarChartOutlined,
  CheckCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { KruskalComponent } from "../components/KruskalComponent";
import { PrimComponent } from "../components/PrimComponent";
import { ToDoComponent } from "../components/ToDoComponent";

export const mainRoutes = [
  {
    title: "Početna",
    path: "/",
    icon: <HomeOutlined style={{ fontSize: "1.3rem" }} />,
    component: () => (
      <div style={{ fontSize: "2rem", textAlign: "center" }}>
        Seminarski rad
        <p style={{ fontSize: "1rem" }}>Primov i Kruskalov algoritam</p>
      </div>
    ),
  },
  {
    title: "Primov algoritam",
    path: "/primov",
    icon: <DotChartOutlined style={{ fontSize: "1.3rem" }} />,
    component: PrimComponent,
  },
  {
    title: "Kruskalov Algoritam",
    path: "/kruskalov",
    icon: <RadarChartOutlined style={{ fontSize: "1.3rem" }} />,
    component: KruskalComponent,
  },
  {
    title: "To-Do Lista",
    path: "/to-do-lista",
    icon: <CheckCircleOutlined style={{ fontSize: "1.3rem" }} />,
    component: ToDoComponent,
  },
];

export const renderRoutes = () => {
  return mainRoutes.map((route, index) => (
    <Route exact path={route.path} component={route.component} key={index} />
  ));
};

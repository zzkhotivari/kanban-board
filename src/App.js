import React  from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch }    from "react-router-dom";
import Home   from "./pages/Home";
import Labels from "./pages/Labels";
import             "react-datepicker/dist/react-datepicker.css";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/labels">
          <Labels />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withAuth } from "../lib/AuthProvider";
import axios from 'axios';
import FormCheck from "../components/FormCheck";
import FormBullet from "../components/FormBullet";
import FormFinance from "../components/FormFinance";
import services from "../lib/auth-service";


class Dashboard extends Component {

  state = { month: 0, 
            year: 0,
            agenda: {} };


  handleFormCreate = async (event) => {
    event.preventDefault();

    try {
      const { month, year } = this.state;
      const userId = this.props.user._id;
      console.log("month:", month);
      console.log("year:", year);
      console.log("userId: ", userId);
      const agenda = await this.props.creagen({ month, year, userId });
      this.setState({
        month: "", 
        year: "",
        agenda: agenda
      });
    } catch (error) {
        console.log("Error while creating the agenda: ", error);
    }
    return;
  };

  // Idea: when we leave this page in unmount to update the agenda.
  // Question: do we have the page agenda info that is within FormCheck, FormBullet
  // FormFinance here as well or do we have to in each of those components unmount
  // update the agenda???
  
  handleFormUpdate = async (event) => {
    event.preventDefault();
    console.log("I'm in handleFormUpdate");
    let {agenda} = this.state;
    let agenId = agenda._id;
    agenda.reward = "It's been updated succesfully three times."
    console.log("agenda in handleFormUpdate before update: ", agenda);
    console.log("agenda reward: ", agenda.reward);
    const response = services.updateagen({agenId, agenda});
    console.log("after update response is: ", response);
    // services.updateagen({ agendaId: res._id, agenda: this.agenda });
  };

  // childrenUpdateParentState (agenda) {
  //   console.log("I'm back from children");
  //   let agendaCopy = [...this.state.agenda];
  //   this.setState ({agenda});
  // }

  handleFormGet = async (event) => {
    event.preventDefault();
    console.log("I'm within handleFormGet")

    try {
      const { month, year } = this.state;
      const userId = this.props.user._id;
      console.log("month:", month);
      console.log("year:", year);
      console.log("userId: ", userId);
      const agenda = await services.getagen({ year, month, userId });
      console.log("I'm back from get agenda with res: ", agenda);
      this.setState({ agenda: agenda});
    } catch (error) {
        console.log("Error while getting the agenda: ", error);
    }
  };        
        
  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  
  render() {
    const { month, year, agenda } = this.state;
    return (
      <section>
        <form onSubmit={this.handleFormCreate}>

          <label>MONTH:</label>
          <input type="number" name="month" value={month} onChange={this.handleChange} />
          <br/>
          <label>YEAR:</label>
          <input type="number" name="year" value={year} onChange={this.handleChange} />
          <br/>
          <input type="submit" value="CREATE NEW MONTH" />
          <br/>
        </form>
        <button onClick={this.handleFormGet}>
            <span>GET MONTH</span>
        </button>
        <br/>
        <button onClick={this.handleFormUpdate}>
          <span>UPDATE AGENDA</span>
        </button>
        
        <div>
          <FormCheck {...agenda} />
        </div>
        <div>
          <FormBullet {...agenda} />
        </div>
        <div>
          <FormFinance {...agenda} />
        </div>
      </section>
    );
  }
};

export default withAuth(Dashboard);

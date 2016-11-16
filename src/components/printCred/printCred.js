"use strict";
import React from "react";
import AS_SDK from "../../lib/index";
import ClassSelector from "../classSelector/classSelector";
import Navigator from "../navigator/navigator";
import "./printCred.scss";

class PrintCred extends React.Component {

    constructor(props) {
        super(props);

        this.data = AS_SDK.Settings.Configs;

        this.state = {
            departments: this.data.departments,
            classes: this.data.classes,
            numbers: this.data.numbers,
            sez: "Scientifico",
            cls: "1A",
            maxLength: 3,
            fullItems: [],
            filteredItems: [],
            splitItems: [],
            currentItems: []
        };

        this.onChange = this.onChange.bind(this);
        this.getUserList = this.getUserList.bind(this);
    }

    componentDidMount() {
        AS_SDK.Database.UserHandler.getUsers(users => {

            const fullItems = users.sort(AS_SDK.Utility.ArrayHandler.dynamicSort("mail"));
            const filteredItems = AS_SDK.Utility.FilterHandler.filterItems(fullItems, "", this.state.cls, this.state.sez);
            const splitItems = AS_SDK.Utility.ArrayHandler.splitItems(filteredItems, this.state.maxLength);
            const currentItems = splitItems[0];
            const navLength = splitItems.length;

            this.setState({fullItems, filteredItems, splitItems, currentItems, navLength});
        });
    }

    onChange(e, source) {
        const oldState = this.state;
        oldState[source] = e.target.value;

        oldState.filteredItems = AS_SDK.Utility.FilterHandler.filterItems(oldState.fullItems, "", oldState.cls, oldState.sez);
        oldState.splitItems = AS_SDK.Utility.ArrayHandler.splitItems(oldState.filteredItems, oldState.maxLength);
        oldState.currentItems = oldState.splitItems[0];
        oldState.navLength = oldState.splitItems.length;

        this.setState(oldState);
    }

    getUserList() {

        const items = this.state.currentItems;
        let users = [];

        if (items.length < 1)
            return (<p>Non ci sono studenti per questa classe</p>);

        items.map(item => {
            users.push(
                <li className="panel panel-default">
                    <div className="panel-body">
                        <h3>{item.name} {item.surname}</h3>
                        <h4>{item.cls} {item.number} {item.sect}</h4>
                        <h4>Mail:{item.mail} Password:{item.pass}</h4>
                    </div>
                </li>
            );
        });

        return users;

    }

    render() {
        return (
            <section id="printSection">

                <h2 className="page-header">Stampa Credenziali</h2>

                <ClassSelector value={this.state.sez} onChange={e => this.onChange(e, "sez")}
                               options={this.state.departments} placeholder="Sezione"/>

                <ClassSelector value={this.state.cls} onChange={e => this.onChange(e, "cls")}
                               options={this.state.classes} placeholder="Classe"/>

                <hr/>

                <ul className="list">
                    {this.getUserList()}
                </ul>

                <hr/>

                <Navigator length={this.state.navLength}/>
                <button className="btn btn-primary btn-lg" onClick="">Scarica Credenziali</button>
            </section>
        );
    }


}

export default PrintCred;




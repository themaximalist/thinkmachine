import React from "react";
import Settings from "@lib/Settings";

import Interwingle0 from "@assets/interwingle-0.png";
import Interwingle1 from "@assets/interwingle-1.png";
import Interwingle2 from "@assets/interwingle-2.png";
import Interwingle3 from "@assets/interwingle-3.png";

export default class Interwingle extends React.Component {
    get interwingles() {
        return [Interwingle0, Interwingle1, Interwingle2, Interwingle3];
    }

    componentDidMount() {
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown.bind(this));
    }

    handleKeyDown(event) {
        if (event.key !== "Tab") return;

        if (event.target.tagName === "INPUT" || event.target.tagName === "button") {
            return;
        }

        event.preventDefault();
        this.toggleInterwingle(undefined, event.shiftKey);
    }

    async toggleInterwingle(interwingle = undefined, backwards = false) {
        if (typeof interwingle === "undefined") {
            interwingle = this.props.thinkabletype.interwingle;
            interwingle = backwards ? interwingle - 1 : interwingle + 1;
            if (interwingle > 3) interwingle = 0;
            if (interwingle < 0) interwingle = 3;
        }
        this.props.thinkabletype.interwingle = interwingle;
        Settings.interwingle = interwingle;
        this.props.reloadData();
    }

    render() {
        if (this.props.graphData.nodes.length === 0) return null;

        return (
            <div className="" id="interwingle">
                {this.interwingles.map((interwingle, index) => (
                    <button
                        key={`interwingle-${index}`}
                        className={
                            this.props.thinkabletype.interwingle === index ? "active" : ""
                        }
                        onClick={() => this.toggleInterwingle(index)}>
                        <img src={interwingle} />
                    </button>
                ))}
            </div>
        );
    }
}

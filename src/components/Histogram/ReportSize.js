import React from "react";

class ReportSize extends React.Component {

  doReportSize = true;
  width = 0;

  refCallback = element => {
    if (element) {
      this.elementRef = element;
      if (this.width !== element.getBoundingClientRect().width) {
        this.props.getSize(element.getBoundingClientRect());
        this.width = element.getBoundingClientRect().width
      }
      console.log(this.width)
    }
  };

  componentDidUpdate() {
    if (this.doReportSize) {
      this.props.getSize(this.elementRef.getBoundingClientRect());
      this.doReportSize = false;
    }
    console.log("this.width")
  }

  render() {
    return (
      <div ref={this.refCallback} style={{ border: "1px solid red", width: "100%", height: "100%" }}>
      </div>
    );
  }
}

export default ReportSize;

import jsxElem, { render, renderBeforeEnd, renderAfterEnd, renderAndReplace } from "./module";
import expectExport from "expect";

describe("jsxElement usage", () => {
  it("renders a basic html document", () => {
    const element = (
      <div className="highlight" attribute="true">
        Hello <span>world</span>
      </div>
    );

    expect(element.outerHTML).toEqual(
      '<div class="highlight" attribute="true">Hello <span>world</span></div>'
    );
  });

  it("renders a style object as string attribute", () => {
    const element = (
      <div
        className="highlight"
        style={{ left: "20px", marginBottom: "10px" }}
      />
    );

    expect(element.outerHTML).toEqual(
      '<div class="highlight" style="left: 20px; margin-bottom: 10px"></div>'
    );
  });

  it("renders other objecs as string without camelcasing", () => {
    const element = (
      <div
        className="highlight"
        attribute={{ left: "20px", marginBottom: "10px" }}
      />
    );

    expect(element.outerHTML).toEqual(
      '<div class="highlight" attribute="left: 20px; marginbottom: 10px"></div>'
    );
  });

  it("renders a svg with the correct namespace", () => {
    const element = (
      <svg><circle cx="80" cy="80" r="30" fill="red" /></svg>
    );

    expect(element.outerHTML).toEqual(
      '<svg><circle cx="80" cy="80" r="30" fill="red"></circle></svg>'
    );
    expect(element.namespaceURI).toEqual("http://www.w3.org/2000/svg")
  });

  it("sets an attribute if it is true", () => {
    const element = <div className="highlight" required={true} />;

    expect(element.outerHTML).toEqual(
      '<div class="highlight" required="required"></div>'
    );
  });

  it("calls a defined method for components", () => {
    function App(props) {
      return <div>Hello {props.name}</div>;
    }

    const element = <App name="world" />;

    expect(element.outerHTML).toEqual("<div>Hello world</div>");
  });

  it("renders an object with a render method", () => {
    const Component = {
      render() {
        return <div>Hello</div>;
      }
    };

    const element = <Component />;

    expect(element.outerHTML).toEqual("<div>Hello</div>");
  });

  it("adds an event function", () => {
    const mockFunction = jest.fn();

    const element = <div onClick={mockFunction} />;

    expect(element.outerHTML).toEqual("<div></div>");
    element.click();
    expect(mockFunction.mock.calls.length).toBe(1);
  });

  it("does not render props as attributes", () => {
    function Hello(props) {
      return <h1>Hello {props.name}</h1>;
    }

    const CustomSeparator = props => (
      <i>{[...Array(props.dots)].map(idx => ".")}</i>
    );

    const element = <div>
      <Hello name="foo" />
      <CustomSeparator dots={50} />
      <Hello name="bar" />
    </div>;

    expect(element.outerHTML).toEqual("<div><h1>Hello foo</h1><i>..................................................</i><h1>Hello bar</h1></div>");
  });

  it("support fragments", () => {
    function Hello(props) {
      return <>
        <h1>Hello</h1>
        <h1>world</h1>
      </>;
    }

    const element = <div><Hello /></div>;

    expect(element.innerHTML).toEqual("<h1>Hello</h1><h1>world</h1>");
  });
});

describe("render", () => {
  it("adds the output to the element", () => {
    function Hello(props) {
      return <h1>Hello {props.name}</h1>;
    }

    const mockElement = jest.fn();
    render(<Hello name="world" />, { insertAdjacentElement: mockElement });
    expect(mockElement.mock.calls.length).toBe(1);
    expect(mockElement.mock.calls[0][0]).toBe("afterbegin");
    expect(mockElement.mock.calls[0][1].outerHTML).toEqual(
      "<h1>Hello world</h1>"
    );
  });
});

describe("renderBeforeEnd", () => {
  it("adds the output before the end of the element", () => {
    function Hello(props) {
      return <h1>Hello {props.name}</h1>;
    }

    const mockElement = jest.fn();
    renderBeforeEnd(<Hello name="world" />, { insertAdjacentElement: mockElement });
    expect(mockElement.mock.calls.length).toBe(1);
    expect(mockElement.mock.calls[0][0]).toBe("beforeend");
    expect(mockElement.mock.calls[0][1].outerHTML).toEqual(
      "<h1>Hello world</h1>"
    );
  });
});

describe("renderAfterEnd", () => {
  it("adds the output after the end of the element", () => {
    function Hello(props) {
      return <h1>Hello {props.name}</h1>;
    }

    const mockElement = jest.fn();
    renderAfterEnd(<Hello name="world" />, { insertAdjacentElement: mockElement });
    expect(mockElement.mock.calls.length).toBe(1);
    expect(mockElement.mock.calls[0][0]).toBe("afterend");
    expect(mockElement.mock.calls[0][1].outerHTML).toEqual(
      "<h1>Hello world</h1>"
    );
  });
});

describe("renderAndReplace", () => {
  it("replace content and adds the output", () => {
    function Hello(props) {
      return <h1>Hello {props.name}</h1>;
    }

    const mockElement = document.createElement("div");
    document.body.appendChild(mockElement);
    renderAndReplace(<Hello name="world" />, document.body);
    expect(document.body.innerHTML).toEqual(
      "<h1>Hello world</h1>"
    );
  });
});

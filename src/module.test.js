import jsxElem, { render, renderAppend, renderAfter, renderBefore, renderPrepend } from "./module";
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
  it("replaces content and adds the output", () => {
    function Hello(props) {
      return <h1>Hello {props.name}</h1>;
    }

    const mockParent = <div><h1>Exist</h1></div>;
    render(<Hello name="world" />, mockParent);
    expect(mockParent.innerHTML).toEqual(
      "<h1>Hello world</h1>"
    );
  });

  it("replaces contents when top-level JSX element is a fragment", () => {
    const mockParent = <div><h1>Exist</h1></div>;
    const fragmentChild = <>
      <h1>Hello</h1>
      <h1>World</h1>
    </>;
    render(fragmentChild, mockParent);
    expect(mockParent.innerHTML).toEqual(
      "<h1>Hello</h1><h1>World</h1>"
    );
  });
});

describe("renderAppend", () => {
  it("adds the output before the end of the element", () => {
    function Hello(props) {
      return <h1>Hello {props.name}</h1>;
    }

    const mockParent = <div><h1>Exist</h1></div>;
    renderAppend(<Hello name="world" />, mockParent);
    expect(mockParent.innerHTML).toEqual(
      "<h1>Exist</h1><h1>Hello world</h1>"
    );
  });

  it("appends contents when top-level JSX element is a fragment", () => {
    const mockParent = <div><h1>Exist</h1></div>;
    const fragmentChild = <>
      <h1>Hello</h1>
      <h1>World</h1>
    </>;
    renderAppend(fragmentChild, mockParent);
    expect(mockParent.innerHTML).toEqual(
      "<h1>Exist</h1><h1>Hello</h1><h1>World</h1>"
    );
  });
});

describe("renderPrepend", () => {
  it("adds the output at the start of the element", () => {
    function Hello(props) {
      return <h1>Hello {props.name}</h1>;
    }

    const mockParent = <div><h1>Exist</h1></div>;
    renderPrepend(<Hello name="world" />, mockParent);
    expect(mockParent.innerHTML).toEqual(
      "<h1>Hello world</h1><h1>Exist</h1>"
    );
  });

  it("prepends contents when top-level JSX element is a fragment", () => {
    const mockParent = <div><h1>Exist</h1></div>;
    const fragmentChild = <>
      <h1>Hello</h1>
      <h1>World</h1>
    </>;
    renderPrepend(fragmentChild, mockParent);
    expect(mockParent.innerHTML).toEqual(
      "<h1>Hello</h1><h1>World</h1><h1>Exist</h1>"
    );
  });
});

describe("renderAfter", () => {
  it("adds the output after the end of the element", () => {
    function Hello(props) {
      return <h1>Hello {props.name}</h1>;
    }

    const mockElement = jest.fn();
    renderAfter(<Hello name="world" />, { insertAdjacentElement: mockElement });
    expect(mockElement.mock.calls.length).toBe(1);
    expect(mockElement.mock.calls[0][0]).toBe("afterend");
    expect(mockElement.mock.calls[0][1].outerHTML).toEqual(
      "<h1>Hello world</h1>"
    );
  });

  it("throws an error when given a fragment", () => {
    const mockElement = jest.fn();
    expect(() => {
      renderAfter(<></>, { insertAdjacentElement: mockElement });
    }).toThrow("renderAfter does not support top-level fragment rendering");
  });
});

describe("renderBefore", () => {
  it("adds the output before the start of the element", () => {
    function Hello(props) {
      return <h1>Hello {props.name}</h1>;
    }

    const mockElement = jest.fn();
    renderBefore(<Hello name="world" />, { insertAdjacentElement: mockElement });
    expect(mockElement.mock.calls.length).toBe(1);
    expect(mockElement.mock.calls[0][0]).toBe("beforebegin");
    expect(mockElement.mock.calls[0][1].outerHTML).toEqual(
      "<h1>Hello world</h1>"
    );
  });

  it("throws an error when given a fragment", () => {
    const mockElement = jest.fn();
    expect(() => {
      renderBefore(<></>, { insertAdjacentElement: mockElement });
    }).toThrow("renderBefore does not support top-level fragment rendering");
  });
});

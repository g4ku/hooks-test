import * as React from "react";
import { unmountComponentAtNode } from "react-dom";
import { render } from "@testing-library/react";
import { shallow, mount } from "enzyme";
import { ChildComponent, ChildProps, Foo } from "./ChildComponent";

describe("ChildComponent", () => {
  let count: number;
  let props: ChildProps;
  let container: HTMLElement | null;

  let useEffect: jest.SpyInstance;

  // https://blog.carbonfive.com/2019/08/05/shallow-testing-hooks-with-enzyme/
  const mockUseEffect = () => {
    // mockImplementationを設定しなければ何もしない
    useEffect.mockImplementationOnce(f => f());
  };

  beforeEach(() => {
    // Component側で Reactだけimportして React.useEffect として使っているか useEffect をimportしているかでテスト側のimportの仕方が異なる
    // React.useEffectの場合は import React from "react"、useEffectの場合は import * as React from "react"
    useEffect = jest.spyOn(React, "useEffect");

    count = 0;
    props = {
      handleMount: jest.fn(),
      handleUnmount: jest.fn(),
      handleUpdate: jest.fn(),
      handleUpdated: jest.fn(),
      count
    };

    container = document.createElement("dev");
    document.body.appendChild(container);
    document.title = "React App";
  });
  afterEach(() => {
    useEffect.mockClear();
    container && unmountComponentAtNode(container);
    container?.remove();
    container = null;
  });

  it("shallow renderはuseEffectが発火しない", () => {
    let wrapper;
    wrapper = shallow(<ChildComponent {...props} />, { attachTo: container });
    expect(props.handleMount).not.toHaveBeenCalled();
    // shallow renderであることの確認
    expect(wrapper.find(Foo)).toHaveLength(1);
  });

  it("shallow renderはuseEffectのMock化で対応", () => {
    let wrapper;
    mockUseEffect();
    mockUseEffect();
    wrapper = shallow(<ChildComponent {...props} />, { attachTo: container });

    expect(props.handleMount).toHaveBeenCalled();
    expect(props.handleUpdated).toHaveBeenCalledTimes(1);
    expect(document.title).toEqual("count changed: 0");

    mockUseEffect();
    mockUseEffect();
    wrapper.setProps({ count: 1 });
    expect(props.handleUpdated).toHaveBeenCalledTimes(2);
    expect(document.title).toEqual("count changed: 1");

    mockUseEffect();
    mockUseEffect();
    wrapper.setProps({ count: 1 });
    // expect(props.handleUpdated).toHaveBeenCalledTimes(2); // 条件は考慮していないため3回目が呼ばれる
    expect(document.title).toEqual("count changed: 1");

    wrapper.unmount();
    expect(props.handleUnmount).not.toHaveBeenCalled();
  });

  it("testing-libraryのrenderは発火する", () => {
    render(<ChildComponent {...props} />, {
      container: container as HTMLElement
    });
    expect(props.handleMount).toHaveBeenCalled();
  });

  it("mount renderも発火する", () => {
    let wrapper;
    wrapper = mount(<ChildComponent {...props} />, { attachTo: container });
    expect(props.handleMount).toHaveBeenCalled();
    expect(props.handleUpdated).toHaveBeenCalledTimes(1);
    expect(document.title).toEqual("count changed: 0");

    // Props.countを変化させる
    wrapper.setProps({ count: 1 });
    expect(props.handleUpdated).toHaveBeenCalledTimes(2);
    expect(document.title).toEqual("count changed: 1");

    // 発火条件外
    wrapper.setProps({ handleMount: jest.fn(), count: 1 });
    expect(props.handleUpdated).toHaveBeenCalledTimes(2);

    // Props.countを変化させる
    wrapper.setProps({ count: 2 });
    expect(props.handleUpdated).toHaveBeenCalledTimes(3);

    expect(props.handleUpdate).not.toHaveBeenCalled();
    wrapper.find("#update-button").simulate("click");
    expect(props.handleUpdate).toHaveBeenCalled();

    expect(wrapper.find("#foo")).toHaveLength(1);

    expect(props.handleUnmount).not.toHaveBeenCalled();
    wrapper.unmount();
    expect(props.handleUnmount).toHaveBeenCalled();
  });
});

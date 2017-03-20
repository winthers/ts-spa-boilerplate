/// <reference path="../node_modules/@types/jasmine/index.d.ts" />

describe("Helloworld", ()=>{
    it("will pass the test", ()=>{
        expect(true).toBeTruthy("should pass the test");
    })
})


import {RootView} from "../src/views/root.view"
describe("rootview", ()=>{
    it("should render", () => {
        var view = new RootView({radio: null});
        expect(view.render().$el.find("h1").text()).toEqual("Project Template")
    })
})
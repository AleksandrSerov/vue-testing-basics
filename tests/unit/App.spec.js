// import Vue from "vue";
import App from "@/App";

import { shallowMount } from "@vue/test-utils";
import { expect } from "chai";

describe("App.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(App);
  });
  it("Отображается корректный контент", () => {
    expect(wrapper.html()).to.contain("<th>Items</th>");
    expect(wrapper.html()).to.contain(
      '<input type="text" placeholder="Add item..." value="" class="prompt">'
    );
    expect(wrapper.html()).to.contain(
      '<button type="submit" disabled="disabled" class="ui button">Add</button>'
    );
    expect(wrapper.html()).to.contain(
      '<span class="ui label">Remove all</span>'
    );
  });

  it("Установка корректный стандартных данных", () => {
    expect(wrapper.vm.item).to.equal("");
    expect(wrapper.vm.items).to.deep.equal([]);
  });

  it('Кнопка "Add" по умолчанию неактивна', () => {
    const addItemButton = wrapper.find(".ui.button");
    expect(addItemButton.element.disabled).to.be.true;
  });
  describe("Пользователь вводит текст в поле", () => {
    let inputField;
    beforeEach(() => {
      inputField = wrapper.find("input");
      inputField.element.value = "New Item";
      inputField.trigger("input");
    });
    it("Должен обновиться текст ", () => {
      expect(wrapper.vm.item).to.equal("New Item");
    });
    it('Когда был введен текст в инпут, кнопка "Add" должна стать активной', () => {
      const addItemButton = wrapper.find(".ui.button");
      expect(addItemButton.element.disabled).to.be.false;
    });
    describe("Затем очищает текст в поле", () => {
      it('Кнопка "Add" должна блокироваться', () => {
        const addItemButton = wrapper.find(".ui.button");
        inputField.element.value = "";
        inputField.trigger("input");
        expect(addItemButton.element.disabled).to.be.true;
      });
    });
    describe("Затем отправляет форму", () => {
      let addItemButton;
      let itemList;
      let inputField;

      beforeEach(() => {
        addItemButton = wrapper.find(".ui.button");
        itemList = wrapper.find(".item-list");
        inputField = wrapper.find("input");

        wrapper.setData({ item: "New Item" });
        addItemButton.trigger("submit");
      });

      it('Должен добавиться новый элемент в "items"', () => {
        expect(wrapper.vm.items).to.contain("New Item");
        expect(itemList.html()).to.contain("<td>New Item</td>");
      });

      it('Значение в "item" должно стать пустой строкой', () => {
        expect(wrapper.vm.item).to.equal("");
        expect(inputField.element.value).to.equal("");
      });

      it('Кнопка "Add" должна блокироваться', () => {
        expect(addItemButton.element.disabled).to.be.true;
      });
    });
  });

  describe("Пользователь кликает на кнопку 'Remove all'", () => {
    let itemList;
    let removeItemsLabel;
    beforeEach(() => {
      itemList = wrapper.find(".item-list");
      removeItemsLabel = wrapper.find(".ui.label");

      wrapper.setData({ items: ["Item #1", "Item #2", "Item #3"] });
    });

    it('Должны удаляться все элементы из "items"', () => {
      removeItemsLabel.trigger("click");

      expect(wrapper.vm.items).to.deep.equal([]);
      expect(itemList.html()).to.not.contain("<td>Item #1</td>");
      expect(itemList.html()).to.not.contain("<td>Item #2</td>");
      expect(itemList.html()).to.not.contain("<td>Item #3</td>");
    });
  });
});

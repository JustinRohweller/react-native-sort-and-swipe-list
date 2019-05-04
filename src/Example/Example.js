// Example usage of CustomSortAndSwipeList
import React, { Component } from "react";
import { View, Text, Dimensions, TouchableOpacity, Image } from "react-native";
import CustomSortAndSwipeList from "@justinrohweller/react-native-sort-and-swipe-list";
import NewRow from "../components/sort/NewRow";

const data = [
  {
    image: "https://placekitten.com/200/240",
    text: "Chloe"
  },
  {
    image: "https://placekitten.com/200/201",
    text: "Jasper"
  },
  {
    image: "https://placekitten.com/200/202",
    text: "Pepper"
  },
  {
    image: "https://placekitten.com/200/203",
    text: "Oscar"
  }
];

const window = Dimensions.get("window");

class Example extends Component {
  static navigationOptions = () => ({
    header: null
  });

  state = { data, order: Object.keys[data] };

  onDeletePress = async rowId => {
    const newData = [...this.state.data];
    newData.splice(rowId, 1);
    this.setState({ data: newData });
  };

  onAddPress = async rowId => {
    const newData = [...this.state.data];
    newData.unshift({
      image: "https://placekitten.com/200/203",
      text: "Oscar"
    });
    this.setState({ data: newData });
  };

  renderHiddenRow = rowId => {
    return (
      <View
        style={{
          flex: 1,
          width: window.width,
          height: 86,
          flexDirection: "row"
        }}
      >
        <TouchableOpacity onPress={() => this.onDeletePress(rowId)}>
          <View>
            <Text>Delete Row</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.onAddPress(rowId)}>
          <View>
            <Text>Add Row</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  renderRow = data => {
    return (
      <View
        style={{
          marginHorizontal: 10,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fff",
          height: 80,
          width: window.width - 40 * 2,
          borderRadius: 4
        }}
      >
        <Image
          source={{ uri: data.image }}
          style={{
            width: 50,
            height: 50,
            marginRight: 30,
            borderRadius: 25
          }}
        />
        <Text
          style={{
            fontSize: 24,
            color: "#222222"
          }}
        >
          {data.text}
        </Text>
      </View>
    );
  };

  render() {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          backgroundColor: "blue"
        }}
      >
        <CustomSortAndSwipeList
          data={this.state.data}
        />
      </View>
    );
  }
}

export default Example;

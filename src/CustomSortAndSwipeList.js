import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Platform
} from "react-native";
import SortableList from "./SortableList";
import MyRow from "./MyRow";

// https://github.com/gitim/react-native-sortable-list
// https://github.com/jemise111/react-native-swipe-list-view/blob/master/docs/SwipeRow.md

const window = Dimensions.get("window");

const defaultData = [
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

class CustomSortAndSwipeList extends Component {
  constructor(props) {
    super(props);
    this.openRowKey = "-1";
    this.rowsRef = {};
    this.state = {
      scrollEnabled: true,
      rowHasMoved: false
    };
  }

  myOnMove = async () => {
    await this.setState({ rowHasMoved: true });
  };

  swipeGestureBegan = () => {
    if (this.props.swipeRowProps.swipeGestureBegan) {
      this.props.swipeRowProps.swipeGestureBegan();
    }
    this.setState({ scrollEnabled: false });
  };

  rowDoneMoving = async () => {
    await this.setState({ rowHasMoved: false });
  };

  onRowOpen = key => {
    this.openRowKey = key;

    // Close all other rows when one is opened.
    let closeRowKey = 0;
    for (let i = 0; i < this.props.data.length; i++) {
      closeRowKey = i;
      if (parseInt(this.openRowKey, 10) !== closeRowKey) {
        const rowRef = this.rowsRef[i.toString()];
        rowRef.closeRow();
      }
    }
    this.setState({ scrollEnabled: true });
    if (this.props.swipeRowProps.onRowOpen) {
      this.props.swipeRowProps.onRowOpen(key);
    }
  };

  onRowClose = async key => {
    // this.props.onRowClose(key);
    if (this.props.swipeRowProps.onRowOpen) {
      this.props.swipeRowProps.onRowClose(key);
    }
    if (this.openRowKey === key) {
      await this.setState({ scrollEnabled: true });
    }
    this.setState({ scrollEnabled: true });
  };

  renderRow = ({ key, index, data, active }) => {
    return (
      <MyRow
        myKey={key} //not a prop
        ref={c => (this.rowsRef[key] = c)} //not a prop
        data={data} //not a prop
        active={active} //not a prop
        rowId={index} //not a prop
        swipeGestureBegan={this.swipeGestureBegan} //leave the way it is. Same with above. //not a prop
        rowHasMoved={this.state.rowHasMoved} //used in myRow to close open rows if needed //not a prop
        rowDoneMoving={this.rowDoneMoving} //used in myRow to close open rows if needed. //not a prop
        openRowKey={this.openRowKey} //used in myRow to close open rows if needed //not a prop
        // useful props options
        onRowPress={rowId => this.props.onRowPress(rowId)} //this.props.onRowPress //prop
        // timeToUpdate={this.state.timeToUpdate} //this.props (because purecomponent and is shallowequals, need to tell it to refresh deep.)
        onRowOpen={this.onRowOpen} //this.props.onRowOpen //prop
        onRowClose={this.onRowClose} //this.props.onRowClose //prop
        swipeRowProps={this.props.swipeRowProps}
        renderHiddenRow={() => this.props.renderHiddenRow(index)}
        rowStyle={this.props.rowStyle}
        renderRow={this.props.renderRow}
        animatedRowViewStyle={this.props.animatedRowViewStyle}
      />
    );
  };

  // put check here for if user no pass list.
  render() {
    return (
      <View style={this.props.containerStyle}>
        <SortableList
          data={this.props.data} //separate, required. //general prop
          disableAnimatedScrolling //not a prop
          myOnMove={this.myOnMove} //used in myRow to close open rows if needed //not a prop
          //
          // SortableListProps: see https://github.com/gitim/react-native-sortable-list
          {...this.props.sortableListProps} //this accounts for all the props below (as well as scrollview props?)
          // if you see warning that there is duplicate props, you tried to pass in one of these bad props.
          // props required to allow swiping as well.
          // should not be changed by passing in different props.
          renderRow={this.renderRow} //not a prop. split into props for myRow.
          manuallyActivateRows //not a prop.
          scrollEnabled={this.state.scrollEnabled} //not a prop.
          onActivateRow={null} // NOT USED
          onPressRow={null} //NOT USED, use general prop onRowPress instead.
        />
      </View>
    );
  }
}

CustomSortAndSwipeList.defaultProps = {
  data: defaultData,
  sortableListProps: {
    style: { flex: 1 },
    contentContainerStyle: {
      width: window.width,

      ...Platform.select({
        ios: {
          paddingHorizontal: 30
        },

        android: {
          paddingHorizontal: 0
        }
      })
    }
  },

  containerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    paddingVertical: 40,

    ...Platform.select({
      ios: {
        paddingTop: 20
      }
    })
  },

  swipeRowProps: {
    style: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: 86, //can be 80 if you want no gaps between items.
      width: window.width
    }
  },

  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 80,
    // width: window.width - 40 * 2, don't add width it cuts edges.
    borderRadius: 10,

    // raised
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOpacity: 1,
    shadowOffset: { height: 2, width: 2 },
    shadowRadius: 2,
    elevation: 0
  },

  animatedRowViewStyle: {
    height: 90 + 6,
    width: window.width,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
  },

  onRowPress: () => {},
  renderHiddenRow: () => (
    <View style={{ flex: 1, width: window.width, height: 86 }} />
  ),

  renderRow: data => (
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
  )
};

export default CustomSortAndSwipeList;

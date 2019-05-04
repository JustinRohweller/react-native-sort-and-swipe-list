import React, { Component } from "react";
import {
  Easing,
  Text,
  Animated,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Dimensions
} from "react-native";
import SwipeRow from "./SwipeRow";

const window = Dimensions.get("window");

class MyRow extends Component {
  constructor(props) {
    super(props);

    this.active = new Animated.Value(0);
    this.onLongPress = false;
    this.state = {
      rowHasMoved: this.props.rowHasMoved
    };
    this.style = {
      ...Platform.select({
        ios: {
          transform: [
            {
              scale: this.active.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.1]
              })
            }
          ],
          shadowRadius: this.active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 10]
          })
        },

        android: {
          transform: [
            {
              scale: this.active.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.07]
              })
            }
          ],
          elevation: this.active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 6]
          })
        }
      })
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.rowHasMoved !== nextProps.rowHasMoved) {
      this.setState({ rowHasMoved: nextProps.rowHasMoved });
    }
    if (this.props.active !== nextProps.active) {
      Animated.timing(this.active, {
        duration: 300,
        easing: Easing.bounce,
        toValue: Number(nextProps.active)
      }).start();
    }
  }

  shouldComponentUpdate() {
    if (this.props.timeToUpdate) {
      return true;
    }
    return false;
  }

  onReleaseRow = async () => {
    // if the row is released
    // AND was a longpress
    // AND order has not been changed, (should change this to onResponderMove)
    // AND been moved at all.
    // THEN put it back.
    if (this.onLongPress) {
      setTimeout(async () => {
        if (!this.props.active) {
          return;
        }
        if (this.state.rowHasMoved === false) {
          if (this.props.toggleRowActive) {
            await this.props.toggleRowActive();
          }
        }
      }, 200);
      this.onLongPress = false;
    }
    await this.props.rowDoneMoving();
  };

  onSortPress = async () => {
    this.onLongPress = true;
    if (this.props.openRowKey === this.props.myKey) {
      await this.closeRow();
      if (this.props.toggleRowActive) {
        this.props.toggleRowActive();
      }
    } else {
      if (this.props.toggleRowActive) {
        this.props.toggleRowActive();
      }
    }
  };

  closeRow = () => {
    this.myRowRef.manuallySwipeRow(0);
  };

  render() {
    return (
      <SwipeRow
        // swipeRowProps, see:
        // https://github.com/jemise111/react-native-swipe-list-view/blob/master/docs/SwipeRow.md
        {...this.props.swipeRowProps} //accounts for all props below.
        // not allowed props. If you see duplicate props warning, you passed a bad prop.
        ref={c => (this.myRowRef = c)}
        closeOnRowPress={null} //not allowed
        onRowPress={null} //not allowed
        onRowOpen={() => this.props.onRowOpen(this.props.myKey)} //not allowed
        onRowClose={() => this.props.onRowClose(this.props.myKey)} //not allowed
        swipeGestureBegan={this.props.swipeGestureBegan} //not allowed
      >
        {this.props.renderHiddenRow()}

        <Animated.View style={[this.props.animatedRowViewStyle, this.style]}>
          <TouchableOpacity
            onLongPress={this.onSortPress}
            onPressOut={() => this.onReleaseRow()}
            onPress={() => this.props.onRowPress(this.props.rowId)}
            style={this.props.rowStyle}
          >
            <View style={this.props.rowStyle}>
              {this.props.renderRow(this.props.data)}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </SwipeRow>
    );
  }
}

export default MyRow;

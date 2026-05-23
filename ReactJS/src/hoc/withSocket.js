import React from 'react';
import { SocketContext } from '../context/SocketContext';

/**
 * HOC withSocket để cung cấp instance socket cho Class Components
 */
export const withSocket = (Component) => {
    return class extends React.Component {
        render() {
            return (
                <SocketContext.Consumer>
                    {(socket) => <Component {...this.props} socket={socket} />}
                </SocketContext.Consumer>
            );
        }
    };
};

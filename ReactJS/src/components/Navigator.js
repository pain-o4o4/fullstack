import React, { Component, Fragment } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import './Navigator.scss';

export function withRouter(Component) {
    return (props) => {
        const navigate = useNavigate();
        const location = useLocation();
        const params = useParams();

        return (
            <Component
                {...props}
                navigate={navigate}
                location={location}
                params={params}
            />
        );
    };
}



class MenuGroup extends Component {
    render() {
        const { name, children } = this.props;
        return (
            <li className="menu-group">
                <div className="menu-group-name">
                    <FormattedMessage id={name} />
                </div>
                <ul className="menu-list list-unstyled">
                    {children}
                </ul>
            </li>
        );
    }
}

class Menu extends Component {
    render() {
        const { name, active, link, children, onClick, hasSubMenu, onLinkClick } = this.props;
        return (
            <li className={"menu" + (hasSubMenu ? " has-sub-menu" : "") + (active ? " active" : "")}>
                {hasSubMenu ? (
                    <Fragment>
                        <span
                            className="menu-link collapsed"
                            onClick={onClick}
                        >
                            <FormattedMessage id={name} />
                            <div className="icon-right">
                                <i className={"far fa-angle-right"} />
                            </div>
                        </span>
                        <div>
                            <ul className="sub-menu-list list-unstyled">
                                {children}
                            </ul>
                        </div>
                    </Fragment>
                ) : (
                    <Link to={link} className="menu-link" onClick={onLinkClick}>
                        <FormattedMessage id={name} />
                    </Link>
                )}
            </li>
        );
    }
}

class SubMenu extends Component {
    getItemClass = path => {
        return this.props.location.pathname === path ? "active" : "";
    };

    render() {
        const { name, link, onLinkClick } = this.props;
        return (
            <li className={"sub-menu " + this.getItemClass(link)}>
                <Link to={link} className="sub-menu-link" onClick={onLinkClick}>
                    <FormattedMessage id={name} />
                </Link>
            </li>
        );
    }
}

const MenuGroupWithRouter = withRouter(MenuGroup);
const MenuWithRouter = withRouter(Menu);
const SubMenuWithRouter = withRouter(SubMenu);

const withRouterInnerRef = (WrappedComponent) => {
    class InnerComponentWithRef extends React.Component {
        render() {
            const { forwardRef, ...rest } = this.props;
            return <WrappedComponent {...rest} ref={forwardRef} />;
        }
    }

    const ComponentWithRef = withRouter(InnerComponentWithRef);

    return React.forwardRef((props, ref) => {
        return <ComponentWithRef {...props} forwardRef={ref} />;
    });
};

class Navigator extends Component {
    state = {
        expandedMenu: {}
    };

    toggle = (groupIndex, menuIndex) => {
        const expandedMenu = {};
        const key = groupIndex + '_' + menuIndex;
        const needExpand = !(this.state.expandedMenu[key] === true);

        if (needExpand) {
            expandedMenu[key] = true;
        }

        this.setState({ expandedMenu });
    };

    isMenuHasSubMenuActive = (location, subMenus, link) => {
        if (subMenus && subMenus.length > 0) {
            const currentPath = location.pathname;
            return subMenus.some(sub => sub.link === currentPath);
        }

        if (link) {
            return location.pathname === link;
        }

        return false;
    };

    checkActiveMenu = () => {
        const { menus, location } = this.props;

        for (let i = 0; i < menus.length; i++) {
            const group = menus[i];
            if (group.menus) {
                for (let j = 0; j < group.menus.length; j++) {
                    const menu = group.menus[j];
                    if (menu.subMenus && this.isMenuHasSubMenuActive(location, menu.subMenus)) {
                        this.setState({
                            expandedMenu: { [i + '_' + j]: true }
                        });
                        return;
                    }
                }
            }
        }
    };

    componentDidMount() {
        this.checkActiveMenu();
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.checkActiveMenu();
        }
    }

    render() {
        const { menus, location, onLinkClick } = this.props;

        return (
            <Fragment>
                <div className="navigator-menu list-unstyled">
                    {menus?.map((group, groupIndex) => (
                        <Fragment key={groupIndex}>
                            <MenuGroupWithRouter name={group.name}>
                                {group.menus?.map((menu, menuIndex) => {
                                    const isActive = this.isMenuHasSubMenuActive(location, menu.subMenus, menu.link);
                                    const isOpen = this.state.expandedMenu[groupIndex + '_' + menuIndex] === true;

                                    return (
                                        <MenuWithRouter
                                            key={menuIndex}
                                            active={isActive}
                                            name={menu.name}
                                            link={menu.link}
                                            hasSubMenu={menu.subMenus}
                                            isOpen={isOpen}
                                            onClick={() => this.toggle(groupIndex, menuIndex)}
                                            onLinkClick={onLinkClick}
                                        >
                                            {menu.subMenus?.map((subMenu, idx) => (
                                                <SubMenuWithRouter
                                                    key={idx}
                                                    name={subMenu.name}
                                                    link={subMenu.link}
                                                    onLinkClick={onLinkClick}
                                                />
                                            ))}
                                        </MenuWithRouter>
                                    );
                                })}
                            </MenuGroupWithRouter>
                        </Fragment>
                    ))}
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = () => ({});
const mapDispatchToProps = () => ({});

export default withRouterInnerRef(connect(mapStateToProps, mapDispatchToProps)(Navigator));
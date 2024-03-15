import React, { useContext, useEffect, useState } from 'react';
import { Drawer, Row, Col, Menu, MenuProps, Tooltip } from 'antd';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { sidebarMenus } from '../utils/constants';
import { helperService } from '../utils/helper';

interface props {
    open: boolean;
    onClose: () => void;
}

const BottomMenu: React.FC<props> = ({ open, onClose }) => {
    const { user } = useContext(UserContext);
    const [sideMenu, setSideMenu] = useState<any[]>([]);

    useEffect(() => {
        if (user.role.toLowerCase() === 'vikin') {
            const sideMenu: MenuProps['items'] = sidebarMenus[1].children
                .filter((x) =>
                    x.visibility.includes(user.subRole.toLowerCase())
                )
                .map((x) => {
                    return {
                        key: x.path,
                        icon: (
                            <Link to={x.path}>
                                <Tooltip title={x.name}>
                                    {React.createElement(x.icon as any)}
                                </Tooltip>
                            </Link>
                        ),
                        label: x.name,
                    };
                });

            setSideMenu(sideMenu);
        } else {
            const sideMenu = sidebarMenus
                .filter((x) => x.visibility.includes(user.role))
                .map((x, index) => {
                    const key = String(index + 1);
                    return {
                        key: `sub${key}`,
                        icon: React.createElement(x.icon),
                        label: x.name,

                        children: x.children.map((y) => {
                            return {
                                key: y.path,
                                label: y.name,
                            };
                        }),
                    };
                });

            setSideMenu(sideMenu);
        }
    }, [user.role]);

    return (
        <>
            {user.role === 'vikin' ? (
                <Menu
                    theme='dark'
                    className='bottom-menu'
                    activeKey={location.pathname}
                    defaultSelectedKeys={[
                        sessionStorage.getItem('lastVisitedRoute') ||
                            helperService.defaultRoute(user.role),
                    ]}
                    mode='horizontal'
                    items={sideMenu}
                    overflowedIndicator={
                        <p className='bg-[#00203f] px-4'>More</p>
                    }
                />
            ) : (
                <Drawer
                    className='bottom-bar !bg-[#001529]'
                    placement='bottom'
                    closable={true}
                    closeIcon={<></>}
                    onClose={onClose}
                    open={open}
                    key={'bottom'}
                    height={250}
                >
                    <Row gutter={16}>
                        {sideMenu.map((menu) => (
                            <Col xs={6}>
                                <h4 className='font-semibold text-gray-400'>
                                    {menu.label}
                                </h4>
                                <div className='space-y-3 mt-2'>
                                    {menu.children.map((subMenu: any) => (
                                        <div>
                                            <Link
                                                onClick={onClose}
                                                className='text-xs !text-gray-300'
                                                to={subMenu.key}
                                            >
                                                {subMenu.label}
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Drawer>
            )}
        </>
    );
};

export default BottomMenu;

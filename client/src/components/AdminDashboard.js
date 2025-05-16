import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navigation from './Navigation'; // Assuming you have a navigation component
import styles from './AdminDashboard.module.css'; // Assuming you have a CSS module for styling

const AdminDashboard = ({ handleLogout }) => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    return;
                }
                const res = await axios.get('http://localhost:5000/api/admin/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUsers(res.data);
                console.log('Users fetched successfully:', res.data);
            } catch (err) {
                console.error('Error fetching users:', err);
                setMessage('Error fetching users.');
            }
        };
        fetchUsers();
    }, []);

    const handleEdit = (user) => {
        const newName = prompt('Enter new name:', user.name);
        const newEmail = prompt('Enter new email:', user.email);
        const newUsername = prompt('Enter new username:', user.username);

        axios.put(`http://localhost:5000/api/admin/users/${user._id}`, {
            name: newName,
            email: newEmail,
            username: newUsername
        }, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(res => {
            setUsers(users.map(u => u._id === user._id ? res.data : u));
        }).catch(err => {
            console.error('Error updating user:', err);
        });
    };

    const handleDelete = (userId) => {
        axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(res => {
            setUsers(users.filter(user => user._id !== userId));
        }).catch(err => {
            console.error('Error deleting user:', err);
        });
    };

    const handleChangeRole = (user) => {
        const isAdmin = confirm('Make this user an admin?');

        axios.put(`http://localhost:5000/api/admin/users/${user._id}/role`, {
            isAdmin
        }, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(res => {
            setUsers(users.map(u => u._id === user._id ? res.data : u));
        }).catch(err => {
            console.error('Error changing user role:', err);
        });
    };

    const handleAddMoney = (user) => {
        const amount = parseFloat(prompt('Enter amount to add:'));
        if (isNaN(amount) || amount <= 0) {
            alert('Invalid amount');
            return;
        }

        axios.post(`http://localhost:5000/api/admin/users/${user._id}/wallet/add`, {
            amount
        }, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(res => {
            setUsers(users.map(u => u._id === user._id ? { ...u, wallet: res.data.wallet } : u));
        }).catch(err => {
            console.error('Error adding money to wallet:', err);
        });
    };

    const handleWithdrawMoney = (user) => {
        const amount = parseFloat(prompt('Enter amount to withdraw:'));
        if (isNaN(amount) || amount <= 0) {
            alert('Invalid amount');
            return;
        }

        axios.post(`http://localhost:5000/api/admin/users/${user._id}/wallet/withdraw`, {
            amount
        }, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(res => {
            setUsers(users.map(u => u._id === user._id ? { ...u, wallet: res.data.wallet } : u));
        }).catch(err => {
            console.error('Error withdrawing money from wallet:', err);
        });
    };

    const filteredUsers = users.filter(user =>
        (user.name && user.name.toLowerCase().includes(search.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(search.toLowerCase())) ||
        (user.username && user.username.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className={styles.container}>
            <Navigation handleLogout={handleLogout} />
            <div className={styles.dashboard}>
                <h2>Admin Dashboard</h2>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.searchInput}
                />
                <table className={styles.userTable}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Wallet</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.username}</td>
                                <td>{user.wallet}</td>
                                <td>
                                    <button onClick={() => handleEdit(user)}>Edit</button>
                                    <button onClick={() => handleDelete(user._id)}>Delete</button>
                                    <button onClick={() => handleChangeRole(user)}>Change Role</button>
                                    <button onClick={() => handleAddMoney(user)}>Add Money</button>
                                    <button onClick={() => handleWithdrawMoney(user)}>Withdraw Money</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default AdminDashboard;

/** @format */

import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showFriendDetails, setShowFriendDetails] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleDisplayFriend(friend) {
    setShowFriendDetails((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelectedFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
  }

  function handleSplitBill(value) {
    console.log(value);
    setShowFriendDetails((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendLists
          showFriends={showFriendDetails}
          onSelectFriend={handleSelectedFriend}
          selectFriend={selectedFriend}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleDisplayFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FriendLists({ showFriends, onSelectFriend, selectFriend }) {
  return (
    <ul>
      {showFriends.map((friend) => (
        <Friends
          friend={friend}
          key={friend.id}
          onSelectFriend={onSelectFriend}
          selectFriend={selectFriend}
        />
      ))}
    </ul>
  );
}

function Friends({ friend, onSelectFriend, selectFriend }) {
  const isSelected = selectFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe's you {friend.balance}€
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelectFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleFormSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID;
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);
  }

  return (
    <form className="form-add-friend" onSubmit={handleFormSubmit}>
      <label>🫂 Friends name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>😊 Image's URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>;
    </form>
  );
}

function FormSplitBill({ selectFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const billPayedByWho = bill ? bill - userExpense : "";
  const [billPay, setBillPay] = useState("user");

  function handleBillSubmit(e) {
    e.preventDefault();

    if (!bill || !userExpense) return;

    onSplitBill(billPay === "user" ? billPayedByWho : -userExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleBillSubmit}>
      <h2>Split a bill with {selectFriend.name}</h2>

      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🫂 Your expense</label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) =>
          setUserExpense(
            Number(e.target.value) > bill ? userExpense : Number(e.target.value)
          )
        }
      />

      <label>🫂 {selectFriend.name}'s' expense</label>
      <input type="text" disabled value={billPayedByWho} />

      <label>💳 Who is paying the bill</label>
      <select value={billPay} onChange={(e) => setBillPay(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}

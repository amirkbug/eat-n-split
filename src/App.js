import { fireEvent } from "@testing-library/react";
import "./index";
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

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddfriend, setShowaddfriend] = useState(false);
  const [friends, setFriend] = useState(initialFriends);
  const [selectedfriend, setSelectedfriend] = useState(null);

  function handleshowaddfriedn() {
    setShowaddfriend((show) => !show);
  }

  function handleaddfriend(friend) {
    setFriend((friends) => [...friends, friend]);
    setShowaddfriend(false);
  }

  function handleselection(friend) {
    // setSelectedfriend(friend);
    setSelectedfriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowaddfriend(false);
  }

  function handlesplitbill(value) {
    setFriend(
      friends.map((friend) =>
        friend.id === selectedfriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedfriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelection={handleselection}
          selectedfriend={selectedfriend}
        />

        {showAddfriend && <FormAddfriend onAddFriend={handleaddfriend} />}
        <Button onClick={handleshowaddfriedn}>
          {showAddfriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedfriend && (
        <FormSplitBill
          selectedfriend={selectedfriend}
          onsplitbill={handlesplitbill}
          key={selectedfriend.id}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelection, selectedfriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          selectedfriend={selectedfriend}
          key={friend.id}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedfriend }) {
  const isSelected = selectedfriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          you owe {friend.name} {Math.abs(friend.balance)} $
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} ows you {Math.abs(friend.balance)} $
        </p>
      )}
      {friend.balance === 0 && <p>you and {friend.name} are even</p>}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddfriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=499476");

  function handlesubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48?u=499476");
  }

  return (
    <form className="form-add-friend" onSubmit={handlesubmit}>
      <label>🧑‍🤝‍👩🏼friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🅰️image url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedfriend, onsplitbill }) {
  const [bill, setbill] = useState("");
  const [paidbyuser, setPaiduser] = useState("");
  const paidbyfriend = bill ? bill - paidbyuser : "";
  const [whoispaying, setWhoispaying] = useState("user");
  function handlesubmit(e) {
    e.preventDefault();

    if (!bill || !paidbyfriend) return;
    onsplitbill(whoispaying === "user" ? paidbyfriend : -paidbyuser);
  }

  return (
    <form className="form-split-bill" onSubmit={handlesubmit}>
      <h2>split a Bill with {selectedfriend.name}</h2>

      <label>💰Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setbill(Number(e.target.value))}
      />

      <label>👨‍🦰youre expenses</label>
      <input
        type="text"
        value={paidbyuser}
        onChange={(e) =>
          setPaiduser(Number(e.target.value)) > bill
            ? paidbyuser
            : Number(e.target.value)
        }
      />

      <label>👩{selectedfriend.name}'expens</label>
      <input type="text" disabled value={paidbyfriend} />

      <label>who is paying the bill</label>
      <select
        value={whoispaying}
        onChange={(e) => setWhoispaying(e.target.value)}
      >
        <option value="user">you</option>
        <option value="friend">{selectedfriend.name}</option>
      </select>

      <Button>split bill</Button>
    </form>
  );
}

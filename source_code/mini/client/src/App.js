import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import Auction from "./Auction";
import AuctionList from "./AuctionList";
// This site has 3 pages, all of which are rendered
// dynamically in the browser (not server rendered).
//
// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.

export default function App() {
  return (
    <Router>
<ul >          {/* <li>
            <Link to="/">Home</Link>
          </li> */}
          <li className="nav-item">
            <a href="/">Auctions</a>
          </li>
          <li className="nav-item">
            <a href="/auctionlist">AuctionList</a>
          </li>
        </ul>

        <hr />

        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Routes>
          {/* <Route exact path="/">
            <Home />
          </Route> */}
          <Route exact path="/" element={<Auction />}/>
          <Route path="/auctionlist" element={<AuctionList />}/>
        </Routes>
    </Router>
  );
}

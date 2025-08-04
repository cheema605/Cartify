<div id="top">

<!-- HEADER STYLE: CLASSIC -->
<div align="center">

<img src="/logo.png" width="30%" style="position: relative; top: 0; right: 0;" alt="Project Logo"/>

# CARTIFY

<em></em>

<!-- BADGES -->
<!-- local repository, no metadata badges. -->

<em>Built with the tools and technologies:</em>

<img src="https://img.shields.io/badge/Express-000000.svg?style=default&logo=Express&logoColor=white" alt="Express">
<img src="https://img.shields.io/badge/JSON-000000.svg?style=default&logo=JSON&logoColor=white" alt="JSON">
<img src="https://img.shields.io/badge/npm-CB3837.svg?style=default&logo=npm&logoColor=white" alt="npm">
<img src="https://img.shields.io/badge/Autoprefixer-DD3735.svg?style=default&logo=Autoprefixer&logoColor=white" alt="Autoprefixer">
<img src="https://img.shields.io/badge/PostCSS-DD3A0A.svg?style=default&logo=PostCSS&logoColor=white" alt="PostCSS">
<img src="https://img.shields.io/badge/.ENV-ECD53F.svg?style=default&logo=dotenv&logoColor=black" alt=".ENV">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=default&logo=JavaScript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/React-61DAFB.svg?style=default&logo=React&logoColor=black" alt="React">
<br>
<img src="https://img.shields.io/badge/Python-3776AB.svg?style=default&logo=Python&logoColor=white" alt="Python">
<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=default&logo=TypeScript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/GitHub%20Actions-2088FF.svg?style=default&logo=GitHub-Actions&logoColor=white" alt="GitHub%20Actions">
<img src="https://img.shields.io/badge/Cloudinary-3448C5.svg?style=default&logo=Cloudinary&logoColor=white" alt="Cloudinary">
<img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=default&logo=ESLint&logoColor=white" alt="ESLint">
<img src="https://img.shields.io/badge/Axios-5A29E4.svg?style=default&logo=Axios&logoColor=white" alt="Axios">
<img src="https://img.shields.io/badge/CSS-663399.svg?style=default&logo=CSS&logoColor=white" alt="CSS">
<img src="https://img.shields.io/badge/Chart.js-FF6384.svg?style=default&logo=chartdotjs&logoColor=white" alt="Chart.js">

</div>
<br>

---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
    - [Project Index](#project-index)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Usage](#usage)
    - [Testing](#testing)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview



---

## Features

<ul>
  <li><strong>🔐 Authentication & User Management:</strong> Secure login and signup using JWT-based authentication.</li>
  <li><strong>🧠 Personalized Explore Page:</strong> Product recommendations powered by a dynamic recommendation algorithm based on user preferences and past activity.</li>
  <li><strong>🔍 Smart Search:</strong> Search bar with category and filter functionality for easy product discovery.</li>
  <li><strong>🛒 Shopping Features:</strong>
    <ul>
      <li>Support for both <strong>Rent</strong> and <strong>Buy</strong> options</li>
      <li><strong>Wishlist</strong> to save favorite items</li>
      <li><strong>Shopping Cart</strong> with quantity and price handling</li>
      <li><strong>Secure Checkout</strong> flow</li>
    </ul>
  </li>
  <li><strong>🏬 Seller Store Dashboard:</strong>
    <ul>
      <li>Create and manage a seller store</li>
      <li>List products, set pricing, manage availability</li>
      <li>View sales analytics and performance metrics</li>
    </ul>
  </li>
</ul>

---

## Project Structure

```sh
└── Cartify/
    ├── .github
    │   └── workflows
    ├── backend
    │   ├── .gitignore
    │   ├── db
    │   ├── index.js
    │   ├── middleware
    │   ├── package-lock.json
    │   ├── package.json
    │   └── routes
    ├── backup_scripts.sql
    ├── cartify_scripts.sql
    ├── database_handler.sql
    ├── frontend
    │   ├── .gitignore
    │   ├── app
    │   ├── components
    │   ├── context
    │   ├── eslint.config.mjs
    │   ├── hooks
    │   ├── jsconfig.json
    │   ├── lib
    │   ├── Logo
    │   ├── next.config.mjs
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── postcss.config.js
    │   ├── postcss.config.mjs
    │   ├── public
    │   ├── README.md
    │   ├── styles
    │   └── tailwind.config.js
    ├── package-lock.json
    ├── package.json
    └── src
        └── app
```


---

## Getting Started

### Prerequisites

This project requires the following dependencies:

- **Programming Language:** JavaScript
- **Package Manager:** Npm

### Installation

Build Cartify from the source and intsall dependencies:

1. **Clone the repository:**

    ```sh
    ❯ git clone ../Cartify
    ```

2. **Navigate to the project directory:**

    ```sh
    ❯ cd Cartify
    ```

3. **Install the dependencies:**

<!-- SHIELDS BADGE CURRENTLY DISABLED -->
	<!-- [![npm][npm-shield]][npm-link] -->
	<!-- REFERENCE LINKS -->
	<!-- [npm-shield]: https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white -->
	<!-- [npm-link]: https://www.npmjs.com/ -->

	**Using [npm](https://www.npmjs.com/):**

	```sh
	❯ npm install
	```

### Usage

Run the project with:

**Using [npm](https://www.npmjs.com/):**
```sh
npm start
```

### Testing

Cartify uses the {__test_framework__} test framework. Run the test suite with:

**Using [npm](https://www.npmjs.com/):**
```sh
npm test
```

---

## Roadmap

<h2>✅ Completed Tasks</h2>
<ul>
  <li>✅ <strong>Task 1</strong>: Basic Login with JWT Authentication</li>
  <li>✅ <strong>Task 2</strong>: Database Schema & Setup</li>
  <li>✅ <strong>Task 3</strong>: Implement Explore Page with Recommendations</li>
  <li>✅ <strong>Task 4</strong>: Search Bar with Filtering</li>
  <li>✅ <strong>Task 5</strong>: Rent & Buy Options</li>
  <li>✅ <strong>Task 6</strong>: Wishlist Functionality</li>
  <li>✅ <strong>Task 7</strong>: Cart & Checkout Integration</li>
  <li>✅ <strong>Task 8</strong>: Seller Store with Product Listings, Analytics & Sales Dashboard</li>
</ul>

<h2>🔧 Upcoming Tasks</h2>
<ul>
  <li>🕐 <strong>Task 9</strong>: Implement Product Bidding System</li>
  <li>🕐 <strong>Task 10</strong>: Real-time Bid Updates using WebSockets or Polling</li>
  <li>🕐 <strong>Task 11</strong>: Winning Bid Assignment and Notification</li>
  <li>🕐 <strong>Task 12</strong>: Delivery Management Module</li>
  <li>🕐 <strong>Task 13</strong>: Order Tracking System for Buyers</li>
  <li>🕐 <strong>Task 14</strong>: Delivery Status Update Panel for Sellers</li>
  <li>🕐 <strong>Task 15</strong>: UI/UX Enhancements & Animations</li>
  <li>🕐 <strong>Task 16</strong>: Final Testing, Optimization, and Deployment</li>
</ul>


---

## Contributing

- **💬 [Join the Discussions](../../discussions)**: Share your insights, provide feedback, or ask questions.
- **🐛 [Report Issues](../../issues/new)**: Submit bugs found or log feature requests for the `Cartify` project.
- **💡 [Submit Pull Requests](../../compare)**: Review open PRs, and submit your own PRs.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your LOCAL account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone ./Cartify
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to LOCAL**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="left">
   <a href="https://LOCAL{//Cartify/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=/Cartify">
   </a>
</p>
</details>

---

## License

Cartify is protected under the [LICENSE](https://choosealicense.com/licenses) License. For more details, refer to the [LICENSE](https://choosealicense.com/licenses/) file.

---

## 🙌 Acknowledgments

Grateful to the following individuals for their valuable contributions and support throughout the project:

- **Hamza Akmal** – Core Development & Architecture  
- **Maziah Hasan** – UI/UX Design & Frontend Implementation  
- **Anooshay Khan** – Testing & Feature Validation  
- **Ammar Bin Mudassar** – Project Lead, Full Stack Development & Deployment  

Special thanks to all contributors, mentors, and reference materials that inspired this project.


<div align="right">

[![][back-to-top]](#top)

</div>


[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square


---

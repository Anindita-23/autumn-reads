import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useRole } from "../context/RoleContext";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Badge,
} from "@nextui-org/react";
import { FaSearch, FaBookOpen, FaHeart, FaBell } from "react-icons/fa";

import { useSearch } from "../context/SearchContext";

const MainNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { role } = useRole();
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <Navbar
      maxWidth="full"
      className="bg-background/90 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 px-6"
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[3px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
    >
      <NavbarBrand
        className="gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="p-2 bg-primary text-white rounded-lg shadow-md">
          <FaBookOpen size={22} />
        </div>
        <div className="flex flex-col">
          <p className="font-serif font-bold text-2xl text-text tracking-tight leading-none">
            Autumn<span className="text-primary">Reads</span>
          </p>
          <p className="text-[0.65rem] text-text-muted uppercase tracking-widest font-semibold">
            Premium Ebook Store
          </p>
        </div>
      </NavbarBrand>

      <NavbarContent className="hidden md:flex gap-6" justify="center">
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent text-text font-medium"
                radius="sm"
                variant="light"
              >
                Categories
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="Book categories"
            className="w-[340px]"
            itemClasses={{
              base: "gap-4",
            }}
          >
            <DropdownItem
              key="fiction"
              description="Novels, short stories, and more"
              startContent={<FaBookOpen className="text-primary" />}
              href="/categories/fiction"
            >
              Fiction
            </DropdownItem>
            <DropdownItem
              key="non_fiction"
              description="Biographies, history, and science"
              startContent={<FaBookOpen className="text-secondary" />}
              href="/categories/non-fiction"
            >
              Non-Fiction
            </DropdownItem>
            <DropdownItem
              key="mystery"
              description="Thrillers and detective stories"
              startContent={<FaBookOpen className="text-warning" />}
              href="/categories/mystery"
            >
              Mystery & Thriller
            </DropdownItem>
            <DropdownItem
              key="all"
              description="View all book categories"
              startContent={<FaBookOpen className="text-accent" />}
              href="/categories"
            >
              All Categories
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <NavbarItem>
          <Link
            to="/bestsellers"
            className="text-text hover:text-primary transition-colors font-medium"
          >
            Bestsellers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            to="/new-arrivals"
            className="text-text hover:text-primary transition-colors font-medium"
          >
            New Arrivals
          </Link>
        </NavbarItem>
        {user && (
          <NavbarItem>
            <Link
              to="/library"
              className="text-text hover:text-primary transition-colors font-medium"
            >
              My Library
            </Link>
          </NavbarItem>
        )}
        {user && role === "publisher" && (
          <NavbarItem>
            <Link
              to="/upload"
              className="text-text hover:text-primary transition-colors font-medium"
            >
              Upload Book
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-4">
        <NavbarItem className="hidden lg:flex">
          <Input
            classNames={{
              base: "max-w-full sm:max-w-[18rem] h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-surface border border-primary/10 shadow-inner",
            }}
            placeholder="Search titles, authors..."
            size="sm"
            startContent={<FaSearch size={14} className="text-primary" />}
            type="search"
            radius="lg"
            value={searchQuery}
            onValueChange={setSearchQuery}
            onKeyDown={handleSearch}
          />
        </NavbarItem>

        {!user ? (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link
                to="/login"
                className="text-text font-medium hover:text-primary"
              >
                Login
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                to="/signup"
                className="bg-primary text-white font-medium shadow-lg shadow-primary/30"
                radius="full"
                size="sm"
              >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem>
              <Badge content="2" color="primary" size="sm" shape="circle">
                <Button
                  isIconOnly
                  radius="full"
                  variant="light"
                  className="text-text-muted"
                >
                  <FaBell size={18} />
                </Button>
              </Badge>
            </NavbarItem>
            <NavbarItem>
              <Button
                isIconOnly
                radius="full"
                variant="light"
                className="text-text-muted"
              >
                <FaHeart size={18} />
              </Button>
            </NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform ring-2 ring-primary/20"
                  color="primary"
                  name={user.email?.charAt(0).toUpperCase()}
                  size="sm"
                  src={`https://ui-avatars.com/api/?name=${user.email}&background=9A3B3B&color=fff`}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold text-primary">{user.email}</p>
                </DropdownItem>
                <DropdownItem key="library" href="/library">
                  My Library
                </DropdownItem>
                {role === "publisher" ? (
                  <DropdownItem key="upload" href="/upload">
                    Upload Book
                  </DropdownItem>
                ) : null}
                <DropdownItem key="settings">Settings</DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onPress={handleLogout}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default MainNavbar;

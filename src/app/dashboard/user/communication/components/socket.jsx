"use client";
import io from "socket.io-client";

export const socket = io("https://react-socket-io-o1cc.onrender.com", { autoConnect: true });
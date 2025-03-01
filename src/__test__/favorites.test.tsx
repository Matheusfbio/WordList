// import React from "react";
// import { render, fireEvent, waitFor } from "@testing-library/react-native";
// import { db } from "../../../firebaseConfig";
// import Favorites from "./Favorites";
// import { ref, onValue, remove } from "firebase/database";

// // Mock Firebase database methods
// jest.mock("firebase/database", () => ({
//   ref: jest.fn(),
//   onValue: jest.fn(),
//   remove: jest.fn(),
// }));

// describe("Favorites Component", () => {
//   it("should render correctly with no favorites", async () => {
//     // Mock Firebase response to return no favorites
//     onValue.mockImplementationOnce((_, callback) =>
//       callback({ val: () => null })
//     );

//     const { getByText } = render(<Favorites />);

//     // Wait for component to re-render
//     await waitFor(() => {
//       getByText("Nenhuma palavra favorita");
//     });

//     expect(getByText("Nenhuma palavra favorita")).toBeTruthy();
//   });

//   it("should render a list of favorites", async () => {
//     const mockFavorites = [
//       {
//         id: "1",
//         word: "Test",
//         definition: "Test definition",
//         phonetic: "/test/",
//       },
//     ];

//     // Mock Firebase response to return some favorites
//     onValue.mockImplementationOnce((_, callback) =>
//       callback({ val: () => mockFavorites })
//     );

//     const { getByText } = render(<Favorites />);

//     await waitFor(() => {
//       getByText("Test");
//       getByText("Test definition");
//     });

//     expect(getByText("Test")).toBeTruthy();
//     expect(getByText("Test definition")).toBeTruthy();
//   });

//   it("should call removeFromFavorites when remove button is pressed", async () => {
//     const mockFavorites = [
//       {
//         id: "1",
//         word: "Test",
//         definition: "Test definition",
//         phonetic: "/test/",
//       },
//     ];

//     // Mock Firebase response to return some favorites
//     onValue.mockImplementationOnce((_, callback) =>
//       callback({ val: () => mockFavorites })
//     );
//     remove.mockResolvedValueOnce(undefined);

//     const { getByText } = render(<Favorites />);

//     // Wait for the list to be rendered
//     await waitFor(() => {
//       getByText("Test");
//       getByText("Test definition");
//     });

//     const removeButton = getByText("Remover");

//     // Simulate pressing the remove button
//     fireEvent.press(removeButton);

//     // Verify that remove function was called
//     await waitFor(() => {
//       expect(remove).toHaveBeenCalledWith(ref(db, "favorites/Test"));
//     });
//   });

//   it("should handle errors when removing from favorites", async () => {
//     const mockFavorites = [
//       {
//         id: "1",
//         word: "Test",
//         definition: "Test definition",
//         phonetic: "/test/",
//       },
//     ];

//     // Mock Firebase response to return some favorites
//     onValue.mockImplementationOnce((_, callback) =>
//       callback({ val: () => mockFavorites })
//     );
//     remove.mockRejectedValueOnce(new Error("Firebase error"));

//     const { getByText } = render(<Favorites />);

//     // Wait for the list to be rendered
//     await waitFor(() => {
//       getByText("Test");
//       getByText("Test definition");
//     });

//     const removeButton = getByText("Remover");

//     // Simulate pressing the remove button
//     fireEvent.press(removeButton);

//     // Verify that error was logged (we are just verifying the call here)
//     await waitFor(() => {
//       expect(remove).toHaveBeenCalledWith(ref(db, "favorites/Test"));
//     });
//   });
// });

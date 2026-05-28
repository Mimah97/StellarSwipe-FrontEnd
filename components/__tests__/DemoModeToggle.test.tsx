import { render, screen, fireEvent } from "@testing-library/react";
import { DemoModeToggle } from "@/components/DemoModeToggle";
import { useDemoModeStore } from "@/store/useDemoModeStore";

jest.mock("@/store/useDemoModeStore");

const mockUseDemoModeStore = useDemoModeStore as jest.MockedFunction<typeof useDemoModeStore>;

describe("DemoModeToggle", () => {
  it("renders toggle button in off state", () => {
    mockUseDemoModeStore.mockReturnValue({
      isDemoMode: false,
      toggleDemoMode: jest.fn(),
      setDemoMode: jest.fn(),
    });

    render(<DemoModeToggle />);
    expect(screen.getByText("Demo Mode")).toBeTruthy();
    expect(screen.queryByText("ON")).toBeNull();
  });

  it("renders toggle button in on state", () => {
    mockUseDemoModeStore.mockReturnValue({
      isDemoMode: true,
      toggleDemoMode: jest.fn(),
      setDemoMode: jest.fn(),
    });

    render(<DemoModeToggle />);
    expect(screen.getByText("Demo Mode")).toBeTruthy();
    expect(screen.getByText("ON")).toBeTruthy();
  });

  it("calls toggle on click", () => {
    const mockToggle = jest.fn();
    mockUseDemoModeStore.mockReturnValue({
      isDemoMode: false,
      toggleDemoMode: mockToggle,
      setDemoMode: jest.fn(),
    });

    render(<DemoModeToggle />);
    fireEvent.click(screen.getByRole("button", { name: /enter demo mode/i }));
    expect(mockToggle).toHaveBeenCalled();
  });
});
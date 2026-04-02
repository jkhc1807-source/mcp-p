import { render, screen, fireEvent } from '@testing-library/react';
import ClearableInput from './ClearableInput';

test('renders ClearableInput with label and clear button', () => {
  const onChange = jest.fn();
  render(
    <ClearableInput 
      label="Test Label" 
      name="test" 
      value="initial value" 
      onChange={onChange} 
    />
  );
  
  // 라벨 확인
  expect(screen.getByText('Test Label')).toBeInTheDocument();
  
  // 입력값 확인
  const input = screen.getByDisplayValue('initial value');
  expect(input).toBeInTheDocument();
  
  // 'X' 버튼 확인 및 클릭 테스트
  const clearButton = screen.getByLabelText('Clear input');
  expect(clearButton).toBeInTheDocument();
  
  fireEvent.click(clearButton);
  
  // onChange가 빈 문자열과 함께 호출되었는지 확인
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
    target: expect.objectContaining({ name: 'test', value: '' })
  }));
});
